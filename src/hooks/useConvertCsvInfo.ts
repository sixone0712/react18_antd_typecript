import update from 'immutability-helper';
import { useCallback } from 'react';
import { useIsFetching } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import {
  convertDataTypeNumber,
  convertOutputColumnInput,
  divideDataCsvTable,
  divideFixCsvTable,
  mergeCsvTable,
} from '../lib/util/convertRule';
import {
  convertInfoTableColumnOptionsReducer,
  convertInfoTableSelector,
  convertNewRuleSelector,
  convertOptionSelector,
  setConvertInfoConvert,
  setConvertInfoTableAddReducer,
  setConvertInfoTableDeleteReducer,
  setConvertInfoTableValueReducer,
} from '../reducers/slices/convert';

export default function useConvertCsvInfo() {
  const infoTable = useSelector(convertInfoTableSelector);
  const options = useSelector(convertOptionSelector);
  const columnOptions = useSelector(convertInfoTableColumnOptionsReducer);
  const isNewRule = useSelector(convertNewRuleSelector);
  const dispatch = useDispatch();

  const onChangeRowIndex = useCallback(
    (index: number, num: number) => {
      dispatch(
        setConvertInfoTableValueReducer({
          index,
          value: {
            row_index: num,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeName = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertInfoTableValueReducer({
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
        setConvertInfoTableValueReducer({
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
      const data_type = columnOptions.find((item) => item.column_name === value)?.data_type ?? null;
      dispatch(
        setConvertInfoTableValueReducer({
          index,
          value: convertDataTypeNumber.includes(value)
            ? {
                output_column_select: value,
                output_column: convertOutputColumnInput.includes(value) ? null : value,
                data_type,
              }
            : {
                output_column_select: value,
                output_column: convertOutputColumnInput.includes(value) ? null : value,
                data_type,
                coef: null,
              },
        })
      );
    },
    [dispatch, columnOptions]
  );

  const onChangeDataType = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertInfoTableValueReducer({
          index,
          value: convertDataTypeNumber.includes(value)
            ? {
                data_type: value,
              }
            : {
                data_type: value,
                coef: null,
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
          setConvertInfoTableValueReducer({
            index,
            value: {
              def_type: value,
              def_val: null,
            },
          })
        );
      } else {
        dispatch(
          setConvertInfoTableValueReducer({
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
        setConvertInfoTableValueReducer({
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
      dispatch(setConvertInfoTableDeleteReducer(index));
    },
    [dispatch]
  );

  const onChangeSkip = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        setConvertInfoTableValueReducer({
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
    dispatch(setConvertInfoTableAddReducer());
  }, [dispatch]);

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const indexTable = divideFixCsvTable(infoTable);
      const dataTable = divideDataCsvTable(infoTable);
      const dragRow = infoTable[dragIndex];
      const newDataTable = update(dataTable, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });

      const mergedInfoTable = mergeCsvTable(indexTable, newDataTable);
      dispatch(setConvertInfoConvert({ info: mergedInfoTable }));
    },
    [dispatch, infoTable]
  );

  const fetchingRuleBase = useIsFetching([QUERY_KEY.RULES_CONVERT_RULE_BASE]) ? true : false;

  return {
    infoTable,
    onChangeRowIndex,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    columnOptions,
    options,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onDelete,
    onChangeSkip,
    onAdd,
    moveRow,
    fetchingRuleBase,
    isNewRule,
  };
}
