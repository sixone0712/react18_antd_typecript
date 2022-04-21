import React from 'react';
import globalHook, { Store } from 'use-global-hook';

export type ResponseUploadFile = {
  name: string | undefined;
  fileIndex: number | undefined;
  uid: string | undefined;
  status: string | undefined;
};
type UploadFilesState = {
  uploadFiles: any;
  responseFiles: ResponseUploadFile[];
};

type UploadFilesActions = {
  setUploadFiles: (value: any) => void;
  setResponseFiles: (value: ResponseUploadFile[]) => void;
  initUploadFiles: () => void;
};

const setUploadFiles = (store: Store<UploadFilesState, UploadFilesActions>, value: any) => {
  store.setState({ ...store.state, uploadFiles: value });
};

const setResponseFiles = (store: Store<UploadFilesState, UploadFilesActions>, value: ResponseUploadFile[]) => {
  store.setState({ ...store.state, responseFiles: value });
};

const initUploadFiles = (store: Store<UploadFilesState, UploadFilesActions>) => {
  store.setState({ ...initialState });
};

const initialState: UploadFilesState = {
  uploadFiles: [],
  responseFiles: [],
};

const actions = {
  setUploadFiles,
  setResponseFiles,
  initUploadFiles,
};

const useGlobal = globalHook<UploadFilesState, UploadFilesActions>(React, initialState, actions);

export default function useUploadFiles() {
  const [state, actions] = useGlobal();

  return {
    uploadFiles: state.uploadFiles,
    setUploadFiles: actions.setUploadFiles,
    responseFiles: state.responseFiles,
    setResponseFiles: actions.setResponseFiles,
    initUploadFiles: actions.initUploadFiles,
  };
}
