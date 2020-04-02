import { FC, ChangeEvent, useState } from 'react';
import { CustomInput, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { jsx } from '@emotion/core';

export interface UploadPiletsProps {}

export const UploadPilets: FC<UploadPiletsProps> = () => {
  const [file, setFile] = useState(undefined);

  const uploadPilet = (e: ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files[0]);
  const upload = () => {
    if (file) {
      //TODO upload to temp. feed etc.
      setFile(undefined);
    }
  };

  return (
    <InputGroup>
      <CustomInput type="file" id="upload-pilet" label="Select a local pilet" onChange={uploadPilet} />
      <InputGroupAddon addonType="append">
        <Button color="primary" disabled={!file} onClick={upload}>Upload</Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
