import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiteDBInfo } from '../../lib/api/axios/types';
import { RootState } from '../rootReducer';

export type SiteDrawerOpenType = 'add' | 'edit';

interface SiteInfoState {
  selectedSite: SiteDBInfo | undefined;
  isDrawer: boolean;
  drawerType: SiteDrawerOpenType;
}
interface ConfigureState {
  siteInfo: SiteInfoState;
}

const initialState: ConfigureState = {
  siteInfo: {
    selectedSite: undefined,
    isDrawer: false,
    drawerType: 'add',
  },
};

const configure = createSlice({
  name: 'configure',
  initialState,
  reducers: {
    initSiteInfo: () => initialState,
    setSiteInfoSelectedSite(state, action: PayloadAction<SiteDBInfo | undefined>) {
      state.siteInfo.selectedSite = action.payload;
    },
    setSiteInfoDrawer(state, action: PayloadAction<boolean>) {
      state.siteInfo.isDrawer = action.payload;
    },
    setSiteInfoDrawerType(state, action: PayloadAction<SiteDrawerOpenType>) {
      state.siteInfo.drawerType = action.payload;
    },
  },
});

export const { initSiteInfo, setSiteInfoSelectedSite, setSiteInfoDrawer, setSiteInfoDrawerType } = configure.actions;

export const siteInfoSelectedSite = (state: RootState): SiteInfoState['selectedSite'] =>
  state.configure.siteInfo.selectedSite;
export const siteInfoIsDrawer = (state: RootState): SiteInfoState['isDrawer'] => state.configure.siteInfo.isDrawer;
export const siteInfoDrawerType = (state: RootState): SiteInfoState['drawerType'] =>
  state.configure.siteInfo.drawerType;

export default configure.reducer;
