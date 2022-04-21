import { useCallback } from 'react';
import { useIsFetching } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { convertOutputColumnInput } from '../lib/util/convertRule';
import {
  convertCustomTableSelector,
  convertInfoTableColumnOptionsReducer,
  convertNewRuleSelector,
  convertOptionSelector,
  setConvertCustomTableAddReducer,
  setConvertCustomTableDeleteReducer,
  setConvertCustomTableValueReducer,
} from '../reducers/slices/convert';

export default function useConvertCustom() {
  const customTable = useSelector(convertCustomTableSelector);
  const options = useSelector(convertOptionSelector);
  const columnOptions = useSelector(convertInfoTableColumnOptionsReducer);
  const isNewRule = useSelector(convertNewRuleSelector);
  const dispatch = useDispatch();

  const onChangeName = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            name: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeOutputColumn = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            output_column: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeOutputColumnSelect = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            output_column_select: value,
            output_column: convertOutputColumnInput.includes(value) ? null : value,
            data_type: columnOptions.find((item) => item.column_name === value)?.data_type ?? null,
          },
        })
      );
    },
    [dispatch, columnOptions]
  );

  const onChangeDataType = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            data_type: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeDefaultType = useCallback(
    (index: number, value: string) => {
      if (value === 'lambda' || value === 'text') {
        dispatch(
          setConvertCustomTableValueReducer({
            index,
            value: {
              def_type: value,
              def_val: null,
            },
          })
        );
      } else {
        dispatch(
          setConvertCustomTableValueReducer({
            index,
            value: {
              def_type: value,
              def_val: value,
            },
          })
        );
      }
    },
    [dispatch]
  );

  const onChangeDefaultValue = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            def_val: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onDelete = useCallback(
    (index: number) => {
      dispatch(setConvertCustomTableDeleteReducer(index));
    },
    [dispatch]
  );

  const onChangeSkip = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        setConvertCustomTableValueReducer({
          index,
          value: {
            skip: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onAdd = useCallback(() => {
    dispatch(setConvertCustomTableAddReducer());
  }, [dispatch]);

  const fetchingRuleBase = useIsFetching([QUERY_KEY.RULES_CONVERT_RULE_BASE]) ? true : false;

  return {
    customTable,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    options,
    columnOptions,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onDelete,
    onChangeSkip,
    onAdd,
    isNewRule,
    fetchingRuleBase,
  };
}
