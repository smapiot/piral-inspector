import { FC, ChangeEvent, useState } from 'react';
import { CustomInput, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { jsx } from '@emotion/core';
import { injectPiletsFromUrl } from './utils';

export interface UploadPiletsProps {}

export const UploadPilets: FC<UploadPiletsProps> = () => {
  const [file, setFile] = useState({
    value: undefined,
    key: 0,
  });

  const uploadPilet = (e: ChangeEvent<HTMLInputElement>) =>
    setFile({
      ...file,
      value: e.currentTarget.files[0],
    });
  const upload = () => {
    if (file) {
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
        .then(res => res.json())
        .then(res => res.success && injectPiletsFromUrl(`${url}?id=${res.name}`));
    }

    setFile({ value: undefined, key: file.key + 1 });
  };

  return (
    <InputGroup>
      <CustomInput key={file.key} type="file" id="upload-pilet" label="Select a local pilet" onChange={uploadPilet} />
      <InputGroupAddon addonType="append">
        <Button color="primary" disabled={!file.value} onClick={upload}>
          Upload
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
