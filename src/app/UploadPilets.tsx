import { browser } from 'webextension-polyfill-ts';
import { FC, SyntheticEvent } from 'react';
import { CustomInput } from 'reactstrap';
import { jsx } from '@emotion/core';

export interface UploadPiletsProps {}

export const UploadPilets: FC<UploadPiletsProps> = () => {
  const uploadPilet = (e: SyntheticEvent) => {
    //TODO
    e.preventDefault();
  };

  return <CustomInput type="file" id="upload-pilet" label="Upload a local pilet" onChange={uploadPilet} />;
};
