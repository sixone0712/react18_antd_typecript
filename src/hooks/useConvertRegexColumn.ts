import update from 'immutability-helper';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  setConvertInfo,
  setConvertInfoConvert,
  setConvertInfoTableAddReducer,
  setConvertInfoTableDeleteReducer,
  setConvertInfoTableValueReducer,
} from '../reducers/slices/convert';

export default function useConvertRegexColumn() {
  const infoTable = useSelector(convertInfoTableSelector);
  const options = useSelector(convertOptionSelector);
  const isNewRule = useSelector(convertNewRuleSelector);
  const columnOptions = useSelector(convertInfoTableColumnOptionsReducer);
  const dispatch = useDispatch();

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
      dispatch(
        setConvertInfoTableValueReducer({
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
        setConvertInfoTableValueReducer({
          index,
          value: {
            data_type: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onChangePrefix = useCallback(
    (index: number, value: string) => {
      dispatch(
        setConvertInfoTableValueReducer({
          index,
          value: {
            prefix: value,
          },
        })
      );
    },
    [dispatch]
  );

  const onClickRegex = useCallback(
    (index: number) => {
      dispatch(
        setConvertInfo({
          select_regex: index,
          show_regex: true,
        })
      );
    },
    [dispatch]
  );

  const onChangeGroup = useCallback(
    (index: number, num: number) => {
      dispatch(
        setConvertInfoTableValueReducer({
          index,
          value: {
            re_group: num,
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

  const onChangeCoef = useCallback(
    (index: number, num: number) => {
      dispatch(
        setConvertInfoTableValueReducer({
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
        setConvertInfoTableValueReducer({
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
      const dragRow = dataTable[dragIndex];
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

  return {
    infoTable,
    isNewRule,
    options,
    columnOptions,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    onChangePrefix,
    onClickRegex,
    onChangeGroup,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onChangeCoef,
    onChangeUnit,
    onDelete,
    onChangeSkip,
    onAdd,
    moveRow,
  };
}
