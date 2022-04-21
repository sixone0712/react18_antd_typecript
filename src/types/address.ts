import { AddressInfo } from '../lib/api/axios/types';

export interface AddressOption extends AddressInfo {
  label: string;
  value: string;
}
export interface TransferJobAddressInfo extends AddressOption {
  key: string;
}

export interface TransferAddressBook extends AddressInfo {
  key: string;
}
