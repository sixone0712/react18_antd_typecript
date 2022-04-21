import { FormInstance } from 'antd';
import { TransferDirection } from 'antd/lib/transfer';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { getAddressGroupEmailList } from '../../lib/api/axios/requests';
import { AddressInfo } from '../../lib/api/axios/types';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import { remoteJobVisibleReducer, selectRemoteJobVisible } from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { AddressOption, TransferJobAddressInfo } from '../../types/address';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsModalAddrBook({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<AddressOption[]>([]);
  const visible = useTypedSelector(selectRemoteJobVisible('isAddrBook'));
  const dispatch = useDispatch();

  const { data, isFetching } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_GROUPS_EMAILS],
    () => getAddressGroupEmailList(),
    {
      enabled: visible,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of group and email!`, error);
      },
    }
  );

  const addressList: TransferJobAddressInfo[] = useMemo(
    () =>
      data?.map((item: AddressInfo) => {
        const { name, group, id, email } = item;
        return {
          key: id.toString(),
          ...item,
          label: group ? `@${name}` : `${name} <${email}>`,
          value: id.toString(),
        };
      }) ?? [],
    [data]
  );

  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(
        remoteJobVisibleReducer({
          isAddrBook: visible,
        })
      );
    },
    [dispatch]
  );

  const handleOk = useCallback(() => {
    const groupTags: AddressOption[] = [];
    const emailTags: AddressOption[] = [];
    targetKeys?.map((item) => {
      const foundItem = addressList.find((innerItem) => innerItem.id === +item);
      if (foundItem) {
        const { id, name, email, group, label, value } = foundItem;
        if (foundItem.group) {
          groupTags.push({ id, name, email, group, label, value });
        } else {
          emailTags.push({ id, name, email, group, label, value });
        }
      }
    });

    form.setFieldsValue({
      recipient: [...groupTags, ...emailTags, ...customEmails],
    });
    setVisible(false);
  }, [form, setVisible, addressList, targetKeys, customEmails]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleChange = useCallback((targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
  }, []);

  const handleSelectChange = useCallback((sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }, []);

  useEffect(() => {
    if (visible) {
      const recipient = (form.getFieldValue('recipient') as AddressOption[]) ?? [];
      const groups = recipient.filter((item) => item.group).map((item) => item.value);
      const emails = recipient.filter((item) => !item.group && item.id).map((item) => item.value);
      const custom = recipient.filter((item) => !item.group && !item.id);

      setSelectedKeys([]);
      setTargetKeys([...groups, ...emails]);
      setCustomEmails(custom);
    } else {
      setSelectedKeys([]);
      setTargetKeys([]);
      setCustomEmails([]);
    }
  }, [visible]);

  return {
    visible,
    addressList,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  };
}
