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
  convertHeaderTableSelector,
  convertInfoTableColumnOptionsReducer,
  convertNewRuleSelector,
  convertOptionSelector,
  setConvertHeaderTableAddReducer,
  setConvertHeaderTableDeleteReducer,
  setConvertHeaderTableValueReducer,
  setConvertInfoConvert,
} from '../reducers/slices/convert';

export default function useConvertCsvHeader() {
  const headerTable = useSelector(convertHeaderTableSelector);
  const options = useSelector(convertOptionSelector);
  const columnOptions = useSelector(convertInfoTableColumnOptionsReducer);
  const isNewRule = useSelector(convertNewRuleSelector);
  const dispatch = useDispatch();

  const onChangeName = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertHeaderTableValueReducer({
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
        setConvertHeaderTableValueReducer({
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
        setConvertHeaderTableValueReducer({
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
        setConvertHeaderTableValueReducer({
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
          setConvertHeaderTableValueReducer({
            index,
            value: {
              def_type: value,
              def_val: null,
            },
          })
        );
      } else {
        dispatch(
          setConvertHeaderTableValueReducer({
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
        setConvertHeaderTableValueReducer({
          index,
          value: {
            def_val: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeCoef = useCallback(
    (index: number, num: number) => {
      dispatch(
        setConvertHeaderTableValueReducer({
          index,
          value: {
            coef: num,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangeUnit = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertHeaderTableValueReducer({
          index,
          value: {
            unit: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onDelete = useCallback(
    (index: number) => {
      dispatch(setConvertHeaderTableDeleteReducer(index));
    },
    [dispatch]
  );

  const onChangeSkip = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        setConvertHeaderTableValueReducer({
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
    dispatch(setConvertHeaderTableAddReducer());
  }, [dispatch]);

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const indexTable = divideFixCsvTable(headerTable);
      const dataTable = divideDataCsvTable(headerTable);
      const dragRow = dataTable[dragIndex];
      const newDataTable = update(dataTable, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });

      const mergedHeaderTable = mergeCsvTable(indexTable, newDataTable);
      dispatch(setConvertInfoConvert({ header: mergedHeaderTable }));
    },
    [dispatch, headerTable]
  );

  const fetchingRuleBase = useIsFetching([QUERY_KEY.RULES_CONVERT_RULE_BASE]) ? true : false;

  return {
    headerTable,
    options,
    columnOptions,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onChangeCoef,
    onChangeUnit,
    onDelete,
    onChangeSkip,
    onAdd,
    moveRow,
    isNewRule,
    fetchingRuleBase,
  };
}
