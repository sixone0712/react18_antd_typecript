import { BaseRule, CrasError, RuleConvert, RuleData, RuleFilterData } from '../../types/convertRules';
import { regExpLambda, regExpVariable } from './validation';

export type FixCsvTableType = Pick<RuleData, 'index' | 'row_index' | 'col_index' | 'new' | 'column' | 'data'>;
export type DataCsvTableType = Omit<RuleData, 'index' | 'row_index' | 'col_index' | 'new' | 'column' | 'data'>;

export const divideFixCsvTable = (infoTable: RuleData[]): FixCsvTableType[] =>
  infoTable.map(
    (item): FixCsvTableType => ({
      index: item.index,
      row_index: item.row_index,
      col_index: item.col_index,
      data: item.data,
      new: item.new,
      column: item.column,
    })
  );
export const divideDataCsvTable = (infoTable: RuleData[]): DataCsvTableType[] =>
  infoTable.map(
    (item): DataCsvTableType => ({
      id: item.id,
      ruleId: item.ruleId,
      type: item.type,
      name: item.name,
      output_column: item.output_column,
      output_column_select: item.output_column_select,
      prefix: item.prefix,
      regex: item.regex,
      data_type: item.data_type,
      coef: item.coef,
      def_val: item.def_val,
      def_type: item.def_type,
      unit: item.unit,
      re_group: item.re_group,
      skip: item.skip,
    })
  );

export const mergeCsvTable = (fixTable: FixCsvTableType[], dataTable: DataCsvTableType[]): RuleData[] =>
  dataTable.map(
    (item, idx): RuleData => ({
      index: fixTable[idx].index,
      row_index: fixTable[idx].row_index,
      col_index: fixTable[idx].col_index,
      new: fixTable[idx].new,
      id: item.id,
      ruleId: item.ruleId,
      type: item.type,
      column: fixTable[idx].column,
      data: fixTable[idx].data,
      name: item.name,
      output_column: item.output_column,
      output_column_select: item.output_column_select,
      prefix: item.prefix,
      regex: item.regex,
      data_type: item.data_type,
      coef: item.coef,
      def_val: item.def_val,
      def_type: item.def_type,
      unit: item.unit,
      re_group: item.re_group,
      skip: item.skip,
    })
  );

export const convertOutputColumnInput = ['text', 'custom'];
export const convertDataTypeNumber = ['float', 'integer'];
export const setResConvertData = (resData: BaseRule) => ({
  info:
    resData.convert.info.map((item, idx) => ({
      ...item,
      index: idx,
      output_column_select: item.output_column,
      skip: item.skip ?? false,
    })) ?? [],
  header:
    resData.convert.header.map((item, idx) => ({
      ...item,
      index: idx,
      output_column_select: item.output_column,
      coef: convertDataTypeNumber.includes(item.data_type as string) ? item.coef : null,
      skip: item.skip ?? false,
    })) ?? [],
  custom:
    resData.convert.custom.map((item, idx) => ({
      ...item,
      index: idx,
      output_column_select: item.output_column,
      skip: item.skip ?? false,
    })) ?? [],
});

export function checkEmptyTable<T>(list: T[], msg: string) {
  if (list.length === 0) {
    return {
      error_list: [
        {
          key: '',
          name: '',
          reason: msg,
        },
      ],
    };
  }
}

export function checkEmptyDataValue<T>(checkKey: (keyof T)[], list: T[], msg: string) {
  let key: string | number | symbol | null = null;
  const empty: any = list.find((item) => {
    for (const value of checkKey) {
      if (item[value] === null) {
        key = value;
        return true;
      }
    }
    return false;
  });

  if (empty) {
    return {
      error_list: [
        {
          key: key ?? '',
          name: empty?.name ?? '',
          reason: msg.replace('_key_', key ?? '?'),
        },
      ],
    };
  }
}

export function checkDataValue<T>(checkKey: (keyof T)[], list: T[], errorMsg: string) {
  let key: any;

  const foundError: any = list.find((item: any, idx) => {
    for (const value of checkKey) {
      if (value === 'name') {
        if (!regExpVariable.test(item[value])) {
          key = value;
          return true;
        }
      }

      if (value === 'def_type' && item[value] === 'lambda') {
        if (!regExpLambda.test(item['def_val'])) {
          key = value;
          return true;
        }
      }
    }
    return false;
  });

  if (foundError) {
    const dispKey = getCheckKeyName<T>(key);
    return {
      error_list: [
        {
          key: dispKey ?? '',
          name: foundError?.name ?? '',
          reason: errorMsg.replaceAll('_key_', dispKey ?? '?'),
        },
      ],
    };
  }
}

function getCheckKeyName<T>(key: keyof T) {
  switch (key) {
    case 'row_index':
      return 'Row';
    case 'name':
      return 'Name';
    case 'output_column':
      return 'Output Column';
    case 'prefix':
      return 'Prefix';
    case 'regex':
      return 'Regex';
    case 'data_type':
      return 'Data Type';
    case 'coef':
      return 'Coefficient';
    case 'def_val':
      return 'Default Value';
    case 'def_type':
      return 'Default Value';
    case 'unit':
      return 'Unit';
    case 're_group':
      return 'Group';
    case 'type':
      return 'Type';
    case 'condition':
      return 'Condition';
    default:
      return null;
  }
}

export class PreviewValidationError extends Error {
  constructor(message: string, crasError: CrasError) {
    super(message);
    this.name = 'ValidationError';
    this.crasError = crasError;
  }
  crasError: CrasError;
}

export const validateHeadersColumnsData = ({
  ruleType,
  convert,
}: {
  ruleType: 'csv' | 'regex';
  convert: RuleConvert;
}): void => {
  let crasError: CrasError | undefined = undefined;
  const message = 'Failed to data validation!';

  // empty table check header table
  crasError =
    ruleType === 'csv'
      ? checkEmptyTable<RuleData>(convert.header, `emtpy 'Headers' table, please check 'Headers' table tooltip`)
      : undefined;
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // empty table check info table
  crasError =
    ruleType === 'regex'
      ? checkEmptyTable<RuleData>(convert.info, `emtpy 'Info' table, please check 'Info' table tooltip`)
      : undefined;
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // empty data check header Table
  crasError = checkEmptyDataValue<RuleData>(['name', 'data_type'], convert.header, `_key_ is empty in 'Headers' table`);
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // empty data check info Table
  crasError = checkEmptyDataValue<RuleData>(
    ruleType === 'csv' ? ['row_index', 'name', 'data_type'] : ['name', 'data_type'],
    convert.info,
    `_key_ is empty in 'Info' table`
  );
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // empty data check custom Table
  crasError = checkEmptyDataValue<RuleData>(['name'], convert.custom, `_key_ is empty in 'Custom Columns' table`);
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // data format check header Table
  crasError = checkDataValue<RuleData>(
    ['name', 'def_type'],
    convert.header,
    `_key_ is invalid format in 'Headers' table, please check _key_'s tooltip`
  );
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // data format check custom info
  crasError = checkDataValue<RuleData>(
    ['name'],
    convert.info,
    `_key_ is invalid format in 'Headers' table, please check _key_'s tooltip`
  );
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  // data format check custom Table
  crasError = checkDataValue<RuleData>(
    ['name', 'def_type'],
    convert.custom,
    `_key_ is invalid format in 'Custom Columns' table, please check _key_'s tooltip`
  );
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }
};

export const validateDataFilterData = ({ filter }: { filter: RuleFilterData[] }) => {
  let crasError: CrasError | undefined = undefined;
  const message = 'Failed to data validation!';

  crasError = checkEmptyDataValue<RuleFilterData>(['name', 'type'], filter, `_key_ is empty in 'Filter Setting' table`);
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }

  crasError = checkDataValue<RuleFilterData>(
    ['name'],
    filter,
    `_key_ is invalid format in 'Filter Setting' table, please check _key_'s tooltip`
  );
  if (crasError) {
    throw new PreviewValidationError(message, crasError);
  }
};
