import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorLogReduxState, ErrorLogReqDownloadState, ErrorLogShowState } from '../../types/errorLog';
import { RootState } from '../rootReducer';

const initialReqDownload: ErrorLogReqDownloadState = {
  error_code: null,
  occurred_date: null,
  equipment_name: null,
  type: null,
  command: null,
  before: null,
  after: null,
  device: null,
  process: null,
};

const initialState: ErrorLogReduxState = {
  siteId: null,
  siteName: null,
  show: {
    isDownloadModal: false,
    isDownloadDrawer: false,
    isImportModal: false,
  },
  reqDownload: initialReqDownload,
};

const errorLog = createSlice({
  name: 'errorLog',
  initialState,
  reducers: {
    initErrorLogReducer: () => initialState,
    setErrorLogInfoReducer: (state, action: PayloadAction<Partial<ErrorLogReduxState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setErrorLogShowReducer: (state, action: PayloadAction<Partial<ErrorLogShowState>>) => {
      return {
        ...state,
        show: {
          ...state.show,
          ...action.payload,
        },
      };
    },
    setErrorLogReqDownloadReducer: (state, action: PayloadAction<Partial<ErrorLogReqDownloadState>>) => {
      return {
        ...state,
        reqDownload: {
          ...state.reqDownload,
          ...action.payload,
        },
      };
    },
  },
});

export const {
  initErrorLogReducer,
  setErrorLogInfoReducer,
  setErrorLogShowReducer,
  setErrorLogReqDownloadReducer,
} = errorLog.actions;

export const errorLogInfo = (state: RootState): ErrorLogReduxState => state.errorLog;

export const errorLogSiteInfo = (state: RootState): Pick<ErrorLogReduxState, 'siteId' | 'siteName'> => ({
  siteId: state.errorLog.siteId,
  siteName: state.errorLog.siteName,
});

export const errorLogShow = (name: keyof ErrorLogShowState) =>
  createSelector<RootState, ErrorLogReduxState, boolean>(errorLogInfo, (state) => {
    switch (name) {
      case 'isDownloadModal':
        return state.show.isDownloadModal;
      case 'isDownloadDrawer':
        return state.show.isDownloadDrawer;
      case 'isImportModal':
        return state.show.isImportModal;
      default:
        return false;
    }
  });

export const errorLogReqDownload = (state: RootState): ErrorLogReqDownloadState => state.errorLog.reqDownload;

export default errorLog.reducer;
