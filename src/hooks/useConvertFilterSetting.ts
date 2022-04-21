import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertFilterTableSelector,
  convertOptionSelector,
  setConvertFilterTableAddReducer,
  setConvertFilterTableDeleteReducer,
  setConvertFilterTableValueReducer,
} from '../reducers/slices/convert';

export default function useConvertFilterSetting() {
  const filterTable = useSelector(convertFilterTableSelector);
  const options = useSelector(convertOptionSelector);
  const dispatch = useDispatch();

  const onChangeName = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertFilterTableValueReducer({
          index,
          value: {
            name: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeType = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertFilterTableValueReducer({
          index,
          value: {
            type: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeCondition = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertFilterTableValueReducer({
          index,
          value: {
            condition: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onDelete = useCallback(
    (index: number) => {
      dispatch(setConvertFilterTableDeleteReducer(index));
    },
    [dispatch]
  );

  const onAdd = useCallback(() => {
    dispatch(setConvertFilterTableAddReducer());
  }, [dispatch]);

  return {
    filterTable,
    onChangeName,
    onChangeType,
    onChangeCondition,
    options,
    onDelete,
    onAdd,
  };
}
