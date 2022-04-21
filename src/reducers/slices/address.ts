import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddressInfo } from '../../lib/api/axios/types';
import { RootState } from '../rootReducer';

export const DEFAULT_ALL_ADDRESS_KEY = 99999999;
export const DEFAULT_ALL_ADDRESS_NAME = 'All Address';
export const DEFAULT_SEARCHED_NAME = 'All address | Search Result';

interface SelectGroup {
  id: number;
  name: string;
  keyword?: string;
}

interface AddressState {
  select: SelectGroup;
  editEmail: AddressInfo | undefined;
  editGroup: AddressInfo | undefined;
  visibleEmailModal: boolean;
  visibleGroupModal: boolean;
}

const initialState: AddressState = {
  select: {
    id: DEFAULT_ALL_ADDRESS_KEY,
    name: DEFAULT_ALL_ADDRESS_NAME,
    keyword: '',
  },
  editEmail: undefined,
  editGroup: undefined,
  visibleEmailModal: false,
  visibleGroupModal: false,
};

const address = createSlice({
  name: 'address',
  initialState,
  reducers: {
    initAddressStateReducer: () => initialState,
    setSelectGorupReducer(state, action: PayloadAction<SelectGroup>) {
      const { id, name, keyword } = action.payload;
      state.select.id = id;
      state.select.name = name;
      state.select.keyword = keyword ? keyword : '';
    },
    setEditEmailReducer(state, action: PayloadAction<AddressInfo | undefined>) {
      state.editEmail = action.payload;
    },
    setEditGroupReducer(state, action: PayloadAction<AddressInfo | undefined>) {
      state.editGroup = action.payload;
    },
    setVisibleEmailModalReducer(state, action: PayloadAction<boolean>) {
      state.visibleEmailModal = action.payload;
    },
    setVisibleGroupModalReducer(state, action: PayloadAction<boolean>) {
      state.visibleGroupModal = action.payload;
    },
  },
});

export const {
  initAddressStateReducer,
  setSelectGorupReducer,
  setEditEmailReducer,
  setEditGroupReducer,
  setVisibleEmailModalReducer,
  setVisibleGroupModalReducer,
} = address.actions;

export const AddressGroupSelector = (state: RootState): SelectGroup => state.address.select;
export const AddressEditEmailSelector = (state: RootState): AddressInfo | undefined => state.address.editEmail;
export const AddressEditGroupSelector = (state: RootState): AddressInfo | undefined => state.address.editGroup;
export const AddressVisibleEmailModalSelector = (state: RootState): boolean => state.address.visibleEmailModal;
export const AddressVisibleGroupModalSelector = (state: RootState): boolean => state.address.visibleGroupModal;

export default address.reducer;
