import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { divideDataCsvTable, divideFixCsvTable, mergeCsvTable } from '../../lib/util/convertRule';
import {
  PreviewTable,
  PreviewTableData,
  RuleColumnData,
  RuleConvert,
  RuleData,
  RuleFilterData,
  RuleOption,
  SaveConvertRule,
} from '../../types/convertRules';
import { RootState } from '../rootReducer';

export interface ConvertState {
  showAdd: boolean;
  showEdit: boolean;
  showImport: boolean;
  showError: boolean;
  errorLogId: number | null;
  search: string | undefined;
  filterRuleType: 'all' | 'csv' | 'regex';
  info: ConvertRuleInfo;
}

export interface ConvertPreview {
  header: {
    key: string;
    dataIndex: string;
    title: string;
  }[];

  data: {
    //index: number;
    [key: string]: string | number | null;
  }[];

  text: string | null;
}

export interface ConvertRuleInfo extends SaveConvertRule {
  log_name_id: number | undefined;
  new_rule: boolean;
  select: number[];
  tag: string[];
  rule_id: number | undefined;
  columns: RuleColumnData[];
  rule_base: number | undefined;
  edit_rule_name: string | undefined;
  select_info_row: number | undefined;
  select_header_row: number | undefined;
  option: RuleOption | undefined;
  show_regex: boolean;
  select_regex: number | undefined;
  original_sample: PreviewTableData | undefined;
  original_convert: PreviewTableData | undefined;
  preview_sample: ConvertPreview;
  preview_convert: ConvertPreview;
  preview_filter: ConvertPreview;
}

interface ConvertRuleInfoPartial extends Partial<ConvertRuleInfo> {
  key: (keyof ConvertRuleInfo)[];
}

interface ConvertInfoParams
  extends Partial<
    Omit<ConvertRuleInfo, 'original_sample' | 'preview_sample' | 'preview_convert' | 'preview_filter' | 'convert'>
  > {}

interface ConvertInfoPreviewParams
  extends Partial<Pick<ConvertRuleInfo, 'original_sample' | 'preview_sample' | 'preview_convert' | 'preview_filter'>> {}

interface ConvertInfoConvertParams extends Partial<RuleConvert> {}

const initialState: ConvertState = {
  showAdd: false,
  showEdit: false,
  showImport: false,
  showError: false,
  errorLogId: null,
  search: undefined,
  filterRuleType: 'all',
  info: {
    log_name_id: undefined,
    log_name: undefined,
    rule_id: undefined,
    table_name: undefined,
    rule_type: undefined,
    select: [],
    tag: [],
    new_rule: false,
    rule_base: undefined,
    rule_name: undefined,
    edit_rule_name: undefined,
    select_info_row: undefined,
    select_header_row: undefined,
    option: undefined,
    convert: {
      info: [],
      header: [],
      custom: [],
    },
    columns: [],
    filter: [],
    show_regex: false,
    select_regex: undefined,
    original_sample: {
      disp_order: null,
      row: null,
      text: null,
    },
    original_convert: {
      disp_order: null,
      row: null,
      text: null,
    },
    preview_sample: { header: [], data: [], text: null },
    preview_convert: { header: [], data: [], text: null },
    preview_filter: { header: [], data: [], text: null },
  },
};

interface ConvertStepSelectRule {
  rule_name: string | undefined;
  rule_type: 'csv' | 'regex' | undefined;
  select: undefined | number[];
  rule_id: number | undefined;
}

const convert = createSlice({
  name: 'convert',
  initialState,
  reducers: {
    initConvert: () => initialState,
    setConvertShowAddReducer: (state, action: PayloadAction<boolean>) => {
      state.showAdd = action.payload;
    },
    setConvertShowEditReducer: (state, action: PayloadAction<boolean>) => {
      state.showEdit = action.payload;
    },
    setConvertShowImportReducer: (state, action: PayloadAction<boolean>) => {
      state.showImport = action.payload;
    },
    setConvertShowErrorReducer: (state, action: PayloadAction<boolean>) => {
      state.showError = action.payload;
    },
    setConvertErrorLogIdReducer: (state, action: PayloadAction<number|null>) => {
      state.errorLogId = action.payload;
    },
    setConvertSearchReducer: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload;
    },
    setConvertFilterRuleTypeReducer: (state, action: PayloadAction<'all' | 'csv' | 'regex'>) => {
      state.filterRuleType = action.payload;
    },
    setConvertInfo: (state, action: PayloadAction<Partial<ConvertInfoParams>>) => {
      console.log('setConvertInfo', action.payload);
      return {
        ...state,
        info: {
          ...state.info,
          ...action.payload,
        },
      };
    },
    // setConvertInfoPreview: (state, action: PayloadAction<ConvertInfoPreviewParams>) => {
    //   return {
    //     ...state,
    //     info: {
    //       ...state.info,
    //       ...action.payload,
    //     },
    //   };
    // },
    setConvertInfoConvert: (state, action: PayloadAction<ConvertInfoConvertParams>) => {
      return {
        ...state,
        info: {
          ...state.info,
          convert: {
            ...state.info.convert,
            ...action.payload,
          },
        },
      };
    },
    setConvertInfoTableValueReducer: (state, action: PayloadAction<{ index: number; value: Partial<RuleData> }>) => {
      const { index, value } = action.payload;
      state.info.convert.info[index] = {
        ...state.info.convert.info[index],
        ...value,
      };
    },
    setConvertInfoTableAddReducer: (state) => {
      state.info.convert.info.push({
        index: state.info.convert.info.length ?? 0,
        id: null,
        ruleId: null,
        type: null,
        row_index: null,
        col_index: state.info.convert.info.length + 1 ?? 1,
        name: null,
        output_column: null,
        output_column_select: !state.info.new_rule ? 'custom' : undefined,
        prefix: null,
        regex: null,
        data_type: 'text',
        coef: null,
        def_val: 'null',
        def_type: 'null',
        unit: null,
        re_group: null,
        skip: false,
      });
    },
    setConvertInfoTableDeleteReducer: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const indexTable = divideFixCsvTable(state.info.convert.info);
      const dataTable = divideDataCsvTable(state.info.convert.info);
      dataTable.splice(index, 1);
      const mergedInfoTable = mergeCsvTable(indexTable, dataTable);
      state.info.convert.info = mergedInfoTable;
    },

    setConvertHeaderTableValueReducer: (state, action: PayloadAction<{ index: number; value: Partial<RuleData> }>) => {
      const { index, value } = action.payload;
      state.info.convert.header[index] = {
        ...state.info.convert.header[index],
        ...value,
      };
    },
    setConvertHeaderTableAddReducer: (state) => {
      state.info.convert.header.push({
        index: state.info.convert.header.length ?? 0,
        new: true,
        id: null,
        ruleId: null,
        type: null,
        row_index: null,
        col_index: state.info.convert.header.length + 1 ?? 1,
        name: null,
        output_column: null,
        output_column_select: !state.info.new_rule ? 'custom' : undefined,
        prefix: null,
        regex: null,
        data_type: 'text',
        coef: null,
        def_val: 'null',
        def_type: 'null',
        unit: null,
        re_group: null,
        skip: false,
      });
    },
    setConvertHeaderTableDeleteReducer: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const indexTable = divideFixCsvTable(state.info.convert.header);
      const dataTable = divideDataCsvTable(state.info.convert.header);

      dataTable.splice(index, 1);
      const mergedInfoTable = mergeCsvTable(indexTable, dataTable);
      state.info.convert.header = mergedInfoTable;
    },

    setConvertCustomTableValueReducer: (state, action: PayloadAction<{ index: number; value: Partial<RuleData> }>) => {
      const { index, value } = action.payload;
      state.info.convert.custom[index] = {
        ...state.info.convert.custom[index],
        ...value,
      };
    },
    setConvertCustomTableAddReducer: (state) => {
      state.info.convert.custom.push({
        index: state.info.convert.custom.length ?? 0,
        id: null,
        ruleId: null,
        type: null,
        row_index: null,
        col_index: null,
        name: null,
        output_column: null,
        output_column_select: !state.info.new_rule ? 'custom' : undefined,
        prefix: null,
        regex: null,
        data_type: 'text',
        coef: null,
        def_val: 'null',
        def_type: 'null',
        unit: null,
        re_group: null,
        skip: false,
      });
    },
    setConvertCustomTableDeleteReducer: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.info.convert.custom.splice(index, 1);
      state.info.convert.custom = state.info.convert.custom.map((item, idx) => ({
        ...item,
        index: idx,
      }));
    },

    setConvertPreviewSampleReducer: (state, action: PayloadAction<PreviewTable>) => {
      if (action.payload.data) {
        const {
          data: { disp_order, row, text },
        } = action.payload;

        if (row && disp_order) {
          const show_row = Object.values(row).slice(0, 5);
          state.info.preview_sample.header = disp_order.map((item) => ({
            title: item,
            dataIndex: item,
            key: item,
          }));
          state.info.preview_sample.data = show_row.map((item, index) => ({
            //index,
            ...item,
          }));
        } else {
          state.info.preview_sample.header = [];
          state.info.preview_sample.data = [];
        }

        if (text) {
          state.info.preview_sample.text = text;
        } else {
          state.info.preview_sample.text = null;
        }
        state.info.original_sample = action.payload.data;
      } else {
        state.info.preview_sample.header = [];
        state.info.preview_sample.data = [];
        state.info.preview_sample.text = null;
        state.info.original_sample = undefined;
      }
    },
    setConvertPreviewConvertReducer: (state, action: PayloadAction<PreviewTable>) => {
      if (action.payload.data) {
        const {
          data: { disp_order, row },
        } = action.payload;

        if (row && disp_order) {
          const show_row = Object.values(row).slice(0, 5);
          state.info.preview_convert.header = disp_order.map((item) => ({
            title: item,
            dataIndex: item,
            key: item,
          }));
          state.info.preview_convert.data = show_row.map((item, index) => ({
            ...item,
          }));
          state.info.original_convert = action.payload.data;
        } else {
          state.info.preview_convert.header = [];
          state.info.preview_convert.data = [];
          state.info.preview_convert.text = null;
          state.info.original_convert = undefined;
        }
      } else {
        state.info.preview_convert.header = [];
        state.info.preview_convert.data = [];
        state.info.preview_convert.text = null;
        state.info.original_convert = undefined;
      }
    },
    setConvertPreviewFilterReducer: (state, action: PayloadAction<PreviewTable>) => {
      if (action.payload.data) {
        const {
          data: { disp_order, row },
        } = action.payload;

        if (row && disp_order) {
          const show_row = Object.values(row).slice(0, 5);
          state.info.preview_filter.header = disp_order.map((item) => ({
            title: item,
            dataIndex: item,
            key: item,
          }));
          state.info.preview_filter.data = show_row.map((item, index) => ({
            //index,
            ...item,
          }));
        }
      } else {
        state.info.preview_filter.header = [];
        state.info.preview_filter.data = [];
      }
    },
    setConvertFilterTableValueReducer: (
      state,
      action: PayloadAction<{ index: number; value: Partial<RuleFilterData> }>
    ) => {
      const { index, value } = action.payload;
      state.info.filter[index] = {
        ...state.info.filter[index],
        ...value,
      };
    },
    setConvertFilterTableAddReducer: (state) => {
      state.info.filter.push({
        index: state.info.filter.length ?? 0,
        name: null,
        type: state.info.option?.filter_type[0] ?? null,
        condition: null,
      });
    },
    setConvertFilterTableDeleteReducer: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.info.filter.splice(index, 1);
      state.info.filter = state.info.filter.map((item, idx) => ({
        ...item,
        index: idx,
      }));
    },

    setConvertRegexCodeReducer: (state, action: PayloadAction<{ index: number; value: string | null }>) => {
      const { index, value } = action.payload;

      state.info.convert.info[index] = {
        ...state.info.convert.info[index],
        regex: value,
      };
    },
  },
});

export const {
  initConvert,
  setConvertShowAddReducer,
  setConvertShowEditReducer,
  setConvertShowImportReducer,
  setConvertShowErrorReducer,
  setConvertErrorLogIdReducer,
  setConvertSearchReducer,
  setConvertFilterRuleTypeReducer,
  setConvertInfo,
  setConvertInfoConvert,
  setConvertInfoTableValueReducer,
  setConvertInfoTableAddReducer,
  setConvertInfoTableDeleteReducer,
  setConvertHeaderTableValueReducer,
  setConvertHeaderTableAddReducer,
  setConvertHeaderTableDeleteReducer,
  setConvertCustomTableValueReducer,
  setConvertCustomTableAddReducer,
  setConvertCustomTableDeleteReducer,
  setConvertPreviewSampleReducer,
  setConvertPreviewConvertReducer,
  setConvertPreviewFilterReducer,
  setConvertFilterTableValueReducer,
  setConvertFilterTableAddReducer,
  setConvertFilterTableDeleteReducer,
  setConvertRegexCodeReducer,
} = convert.actions;

export const convertShowAddSelector = (state: RootState): boolean => state.convert.showAdd;
export const convertShowEditSelector = (state: RootState): boolean => state.convert.showEdit;
export const convertShowImportSelector = (state: RootState): boolean => state.convert.showImport;
export const convertShowErrorSelector = (state: RootState): boolean => state.convert.showError;
export const convertErrorLogIdSelector = (state: RootState): number | null => state.convert.errorLogId;
export const convertSearchSelector = (state: RootState): string | undefined => state.convert.search;

export const convertFilterRuleTypeSelector = (state: RootState): 'all' | 'csv' | 'regex' =>
  state.convert.filterRuleType;
export const convertPreviewSampleOriginalSelector = (state: RootState): PreviewTableData | undefined =>
  state.convert.info.original_sample;
export const convertPreviewConvertOriginalSelector = (state: RootState): PreviewTableData | undefined =>
  state.convert.info.original_convert;
export const convertPreviewSampleSelector = (state: RootState): ConvertPreview => state.convert.info.preview_sample;
export const convertPreviewConvertSelector = (state: RootState): ConvertPreview => state.convert.info.preview_convert;
export const convertPreviewFilterSelector = (state: RootState): ConvertPreview => state.convert.info.preview_filter;
export const convertLogNameIdSelector = (state: RootState): number | undefined => state.convert.info.log_name_id;
export const convertLogNameSelector = (state: RootState): string | undefined => state.convert.info.log_name;
export const convertSelectSelector = (state: RootState): number[] | undefined => state.convert.info.select;
export const convertTagSelector = (state: RootState): string[] => state.convert.info.tag;
export const convertRuleIdSelector = (state: RootState): number | undefined => state.convert.info.rule_id;
export const convertRuleNameSelector = (state: RootState): string | undefined => state.convert.info.rule_name;
export const convertEditRuleNameSelector = (state: RootState): string | undefined => state.convert.info.edit_rule_name;
export const convertRuleTypeSelector = (state: RootState): 'csv' | 'regex' | undefined => state.convert.info.rule_type;
export const convertNewRuleSelector = (state: RootState): boolean => state.convert.info.new_rule;
export const convertOptionSelector = (state: RootState): RuleOption | undefined => state.convert.info.option;
export const convertTableNameSelector = (state: RootState): string | undefined => state.convert.info.table_name;
export const convertRuleBaseSelector = (state: RootState): number | undefined => state.convert.info.rule_base;
export const convertHeadersColumsLogDefineSelector = (state: RootState) => ({
  new_rule: state.convert.info.new_rule,
  rule_base: state.convert.info.rule_base,
  log_name: state.convert.info.log_name,
  table_name: state.convert.info.table_name,
  rule_name: state.convert.info.rule_name,
  edit_rule_name: state.convert.info.edit_rule_name,
});
export const convertSelectInfoRowSelector = (state: RootState): number | undefined =>
  state.convert.info.select_info_row;
export const convertSelectHeaderRowSelector = (state: RootState): number | undefined =>
  state.convert.info.select_header_row;

export const convertConvertTableSelector = (state: RootState): RuleConvert => state.convert.info.convert;
export const convertInfoTableSelector = (state: RootState): RuleData[] => state.convert.info.convert.info;
export const convertInfoTableColumnOptionsReducer = (state: RootState): RuleColumnData[] => state.convert.info.columns;
export const convertHeaderTableSelector = (state: RootState): RuleData[] => state.convert.info.convert.header;
export const convertCustomTableSelector = (state: RootState): RuleData[] => state.convert.info.convert.custom;
export const convertFilterTableSelector = (state: RootState): RuleFilterData[] => state.convert.info.filter;
export const convertShowRegexSelector = (state: RootState): boolean => state.convert.info.show_regex;
export const convertSelectRegexSelector = (state: RootState): number | undefined => state.convert.info.select_regex;
export const convertRegexSelector = (index: number | undefined) => (state: RootState): string | null | undefined =>
  index !== undefined && index >= 0 ? state.convert.info.convert.info[index].regex : undefined;

export const convertReqConvertCsv = createSelector(convertConvertTableSelector, (convert) => {
  return {
    info:
      convert.info.map((item) => ({
        row_index: item.row_index,
        col_index: item.col_index,
        name: item.name,
        output_column: item.output_column,
        data_type: item.data_type,
        def_val: item.def_val,
        def_type: item.def_type,
        skip: item.skip,
      })) ?? [],
    header:
      convert.header.map((item) => ({
        col_index: item.col_index,
        name: item.name,
        output_column: item.output_column,
        data_type: item.data_type,
        def_val: item.def_val,
        def_type: item.def_type,
        coef: item.coef,
        unit: item.unit,
        skip: item.skip,
      })) ?? [],
    custom:
      convert.custom.map((item) => ({
        name: item.name,
        output_column: item.output_column,
        data_type: item.data_type,
        def_val: item.def_val,
        def_type: item.def_type,
        skip: item.skip,
      })) ?? [],
  };
});

export const convertReqConvertRegex = createSelector(convertConvertTableSelector, (convert) => {
  return {
    info:
      convert.info.map((item) => ({
        name: item.name,
        output_column: item.output_column,
        data_type: item.data_type,
        def_val: item.def_val,
        def_type: item.def_type,
        prefix: item.prefix,
        regex: item.regex,
        coef: item.coef,
        unit: item.unit,
        re_group: item.re_group,
        skip: item.skip,
      })) ?? [],
    header: [],
    custom:
      convert.custom.map((item) => ({
        name: item.name,
        output_column: item.output_column,
        data_type: item.data_type,
        def_val: item.def_val,
        def_type: item.def_type,
        skip: item.skip,
      })) ?? [],
  };
});
export default convert.reducer;
