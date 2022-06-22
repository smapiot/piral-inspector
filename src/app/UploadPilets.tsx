import { FC, ChangeEvent, useState, useEffect } from 'react';
import { CustomInput, InputGroup, InputGroupAddon, Button, Progress, UncontrolledAlert } from 'reactstrap';
import { jsx } from '@emotion/core';
import { injectPiletsFromUrl } from './utils';

export interface UploadPiletsProps {}

const SucceededAlert = ({ piletName }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
    const timeoutId = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(timeoutId);
  }, [piletName]);

  return (
    <UncontrolledAlert color="success" isOpen={open} style={{ marginTop: 10 }}>
      The pilet '{piletName}' was added successfully!
    </UncontrolledAlert>
  );
};

export const UploadPilets: FC<UploadPiletsProps> = () => {
  const [file, setFile] = useState({
    value: undefined,
    key: 0,
  });

  const [uploadData, setUploadData] = useState({
    progress: 0,
    piletName: undefined,
    errMessage: undefined,
  });

  const uploadPilet = (e: ChangeEvent<HTMLInputElement>) =>
    setFile({
      ...file,
      value: e.currentTarget.files[0],
    });

  const upload = () => {
    if (file) {
      setUploadData((data) => ({
        ...data,
        progress: 50,
      }));
      const url = 'https://feed.piral.cloud/api/v1/pilet/temp';
      const form = new FormData();
      form.append('file', file.value);

      fetch(url, {
        method: 'POST',
        body: form,
        headers: {
          authorization: `Basic ac6c202085f07099da1729a20e5750e651ef093ef4a5856c70997a6cc71dcab2`,
        },
      })
        .then((res) => {
          if (res.status === 400) {
            setUploadData((data) => ({
              ...data,
              progress: 0,
            }));
            throw res;
          }
          return res.json();
        })
        .then(
          (res) => {
            res.success && injectPiletsFromUrl(`${url}?id=${res.name}`);
            setUploadData((data) => ({
              ...data,
              progress: 50,
              piletName: res.name,
            }));
          },
          (err) => {
            err.text().then((errorMassage) => {
              const formatedError = JSON.parse(errorMassage);
              setUploadData((data) => ({
                ...data,
                errMessage: formatedError.message,
              }));
            });
          },
        );
    }

    setFile({ value: undefined, key: file.key + 1 });
  };

  return (
    <div>
      <InputGroup>
        <CustomInput key={file.key} type="file" id="upload-pilet" label="Select a local pilet" onChange={uploadPilet} />
        <InputGroupAddon addonType="append">
          <Button color="primary" disabled={!file.value} onClick={upload}>
            Upload
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {uploadData.progress > 0 && (
        <Progress animated color="success" value={uploadData.progress} style={{ marginTop: 10 }} />
      )}

      {uploadData.errMessage && (
        <UncontrolledAlert color="danger" style={{ marginTop: 10 }}>
          Failed to upload a local pilet, {uploadData.errMessage}
        </UncontrolledAlert>
      )}

      {uploadData?.piletName && <SucceededAlert piletName={uploadData?.piletName} />}
    </div>
  );
};
