import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce/lib';
import { searchAddressEmailAndGroup } from '../../lib/api/axios/requests';
import {
  localJobErrorNoticeReducer,
  localJobVisibleReducer,
  selectLocalJobErrorNotice,
} from '../../reducers/slices/localJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { AddressOption } from '../../types/address';

export default function useLocalJobOtherNoticeEmail() {
  const errorNotice = useTypedSelector(selectLocalJobErrorNotice);
  const dispatch = useDispatch();
  const selectRef = useRef<any>(null);
  const deboundcedSearch = useDebouncedCallback((value: string, callback: any) => {
    if (!value) {
      callback([]);
    } else {
      searchAddressEmailAndGroup(value).then((res) => {
        const newList = res.map((item) => ({
          ...item,
          label: item.group ? `@${item.name}` : `${item.name} <${item.email}>`,
          value: `${item.id}`,
        }));
        callback(newList);
      });
    }
  }, 300);

  const onChangeSelectEmail = useCallback(
    (recipient: any) => {
      dispatch(
        localJobErrorNoticeReducer({
          recipient: recipient as AddressOption[],
        })
      );
    },
    [dispatch]
  );

  const onCreateCustomEmail = useCallback(
    (value: string) => {
      const newRecipient: AddressOption = {
        id: 0,
        name: value,
        email: value,
        group: false,
        label: value,
        value: value,
      };

      dispatch(
        localJobErrorNoticeReducer({
          recipient: [...errorNotice.recipient, newRecipient],
        })
      );
    },
    [dispatch, errorNotice.recipient]
  );

  const setVisibleAddr = useCallback(
    (visible: boolean) => {
      dispatch(
        localJobVisibleReducer({
          isAddrBook: visible,
        })
      );
    },
    [dispatch]
  );

  const onSelectEscKeyPress = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') selectRef.current.blur();
  }, []);

  return {
    errorNotice,
    deboundcedSearch,
    onChangeSelectEmail,
    onCreateCustomEmail,
    setVisibleAddr,
    selectRef,
    onSelectEscKeyPress,
  };
}
