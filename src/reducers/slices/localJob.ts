import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddressOption } from '../../types/address';
import { RootState } from '../rootReducer';

export interface LocalJobReduxState {
  siteInfo: LocalJobErrorSiteInfoReduxState;
  errorNotice: LocalJobErrorNoticeReduxState;
  visible: LocalJobVisibleReduxState;
}

export interface LocalJobErrorSiteInfoReduxState {
  siteId: number | null;
  siteName: string | null;
  jobName: string | null;
}
export interface LocalJobErrorNoticeReduxState {
  isEmail: boolean;
  recipient: AddressOption[];
}

export interface LocalJobVisibleReduxState {
  isAddrBook: boolean;
}

const initialState: LocalJobReduxState = {
  siteInfo: {
    siteId: null,
    siteName: null,
    jobName: null,
  },
  errorNotice: {
    isEmail: false,
    recipient: [],
  },
  visible: {
    isAddrBook: false,
  },
};

const localJob = createSlice({
  name: 'localJob',
  initialState,
  reducers: {
    localJobInitReducer: () => initialState,
    localJobSiteInfoReducer: (state, action: PayloadAction<Partial<LocalJobErrorSiteInfoReduxState>>) => {
      state.siteInfo = {
        ...state.siteInfo,
        ...action.payload,
      };
    },
    localJobErrorNoticeReducer: (state, action: PayloadAction<Partial<LocalJobErrorNoticeReduxState>>) => {
      state.errorNotice = {
        ...state.errorNotice,
        ...action.payload,
      };
    },
    localJobVisibleReducer: (state, action: PayloadAction<Partial<LocalJobVisibleReduxState>>) => {
      state.visible = {
        ...state.visible,
        ...action.payload,
      };
    },
  },
});

export const {
  localJobInitReducer,
  localJobSiteInfoReducer,
  localJobErrorNoticeReducer,
  localJobVisibleReducer,
} = localJob.actions;

export const selectLocalJob = (state: RootState) => state.localJob;
export const selectLocalJobSiteInfo = (state: RootState) => state.localJob.siteInfo;
export const selectLocalJobErrorNotice = (state: RootState) => state.localJob.errorNotice;
export const selectLocalJobErrorNoticeIsEmail = createSelector(selectLocalJobErrorNotice, (state) => {
  return state.isEmail;
});
export const selectLocalJobAllVisible = (state: RootState) => state.localJob.visible;
export const selectLocalJobVisible = (name: keyof LocalJobVisibleReduxState) =>
  createSelector<RootState, LocalJobVisibleReduxState, boolean>(
    selectLocalJobAllVisible,
    (state) =>
      ({
        ['isAddrBook']: state.isAddrBook,
      }[name as string] ?? false)
  );

export default localJob.reducer;
