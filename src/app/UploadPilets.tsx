import { FC, ChangeEvent, useState } from 'react';
import { CustomInput, InputGroup, InputGroupAddon, Button, Progress, UncontrolledAlert } from 'reactstrap';
import { jsx } from '@emotion/core';
import { injectPiletsFromUrl } from './utils';

export interface UploadPiletsProps { }

export const UploadPilets: FC<UploadPiletsProps> = () => {
  const [file, setFile] = useState({
    value: undefined,
    key: 0,
  });

  const [progress, setProgress] = useState(0);
  const [failedUpload, setFailedUpload] = useState(false);
  const [piletName, setPiletName] = useState();
  const [succeededUpload, setSucceededUpload] = useState(false);
  const [err, setErr] = useState<any>();

  const uploadPilet = (e: ChangeEvent<HTMLInputElement>) =>
    setFile({
      ...file,
      value: e.currentTarget.files[0],
    });

  const upload = () => {
    if (file) {
      setProgress(50);
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
        .then(res => {
          if (res.status === 400) {
            setProgress(0);
            setFailedUpload(true);
            throw res;
          }
          return res.json();
        })
        .then(res => {
          res.success && injectPiletsFromUrl(`${url}?id=${res.name}`);
          setPiletName(res.name);
          setProgress(0);
          setSucceededUpload(true);
          setInterval(() => setSucceededUpload(false), 5000);
        })
        .catch(err => {
          err.text().then(errorMassage => {
            const formatedError = JSON.parse(errorMassage);
            setErr(formatedError.message);
          });
        });
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

      {progress > 0 && <Progress animated color="success" value={progress} style={{ marginTop: 10 }} />}
      {failedUpload && (
        <UncontrolledAlert
          color="danger"
          isOpen={failedUpload}
          style={{ marginTop: 10 }}
          toggle={() => setFailedUpload(false)}>
          Failed to upload a local pilet, {err}
        </UncontrolledAlert>
      )}

      {piletName && (
        <UncontrolledAlert color="success" isOpen={succeededUpload} style={{ marginTop: 10 }}>
          The pilet {piletName} was added successfully!
        </UncontrolledAlert>
      )}
    </div>
  );
};
