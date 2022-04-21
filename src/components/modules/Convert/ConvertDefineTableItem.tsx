import { blue } from '@ant-design/colors';
import { DeleteOutlined } from '@ant-design/icons';
import { css, SerializedStyles } from '@emotion/react';
import { Form, Input, InputNumber, Popconfirm, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { convertDataTypeNumber } from '../../../lib/util/convertRule';
import { RuleColumnData, RuleData, RuleOption } from '../../../types/convertRules';

// export const ConvertInput = React.memo(function ConvertInputData({
//   value,
//   record,
//   index,
//   onChange,
//   keyName,
//   style,
//   css,
//   disabled = false,
// }: {
//   value?: string | null;
//   record: RuleData;
//   index?: number;
//   onChange: (index: number, value: string) => void;
//   keyName: 'name' | 'unit' | 'prefix';
//   style?: React.CSSProperties | undefined;
//   css?: SerializedStyles;
//   disabled?: boolean;
// }) {
//   const [text, setText] = useState<string | undefined>();

//   const keyNameMemo = useMemo(() => record[keyName], [keyName, record]);
//   const debouncedChange = useDebouncedCallback((index: number, value: string) => {
//     onChange(index, value);
//   }, 300);

//   useEffect(() => {
//     setText(keyNameMemo ?? undefined);
//   }, [keyNameMemo]);

//   // useEffect(() => {
//   //   setText(record[keyName] ?? undefined);
//   // }, [record[keyName]]);

//   return (
//     <Input
//       value={text}
//       css={css}
//       style={style}
//       onChange={(e) => {
//         setText(e.target.value);
//         debouncedChange(record.index as number, e.target.value);
//       }}
//       disabled={disabled || record.skip}
//     />
//   );
// });

export const convertRegexValidate = (value: string | number | undefined, regex: RegExp) => {
  if (value === null || value === undefined || value === '') {
    return 'warning';
  }

  if (regex.test(`${value}`)) {
    return 'success';
  } else {
    return 'error';
  }
};

interface ConvertInputForm {
  value: string | undefined;
}

export const ConvertInput = React.memo(function ConvertInputData({
  value,
  record,
  index,
  onChange,
  keyName,
  style,
  css,
  disabled = false,
  regex,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, value: string) => void;
  keyName: 'name' | 'unit' | 'prefix';
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
  disabled?: boolean;
  regex?: RegExp;
}) {
  const [form] = useForm<ConvertInputForm>();
  const [input, setInput] = useState<string | undefined>(undefined);
  const debouncedChange = useDebouncedCallback((index: number, value: string | null) => {
    onChange(index, value as string);
  }, 300);

  const onValuesChange = (input: ConvertInputForm) => {
    setInput(input.value);
    debouncedChange(record.index as number, input.value ?? null);
  };

  const validateStatus = useMemo(() => (regex ? convertRegexValidate(input, regex) : undefined), [input, regex]);

  useEffect(() => {
    const value = record[keyName] ?? undefined;
    form.setFieldsValue({
      value,
    });
    setInput(value);
  }, [record, keyName, form]);

  return (
    <Form<ConvertInputForm> form={form} onValuesChange={onValuesChange} layout="inline" css={convertInputStyle}>
      <Form.Item name="value" validateStatus={validateStatus}>
        <Input css={css} style={style} disabled={disabled || record.skip} />
      </Form.Item>
    </Form>
  );
});

const convertInputStyle = css`
  .ant-form-item {
    margin-right: 0;
  }
`;

export const ConvertOutputColumnSelect = React.memo(function ConvertHeaderOutputColumnData({
  value,
  record,
  index,
  onChange,
  onChangeSelect,
  options,
  isNew,
  style,
  css,
  disabled = false,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, value: string) => void;
  onChangeSelect: (index: number, value: string) => void;
  options: RuleColumnData[] | undefined;
  isNew: boolean;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
  disabled?: boolean;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);

  useEffect(() => {
    setText(record.output_column ?? undefined);
  }, [record.output_column]);

  return (
    <Space>
      <Input
        value={text}
        css={css}
        style={style}
        onChange={(e) => {
          setText(e.target.value);
          debouncedChange(record.index as number, e.target.value);
        }}
        disabled={disabled || record.skip || (!isNew && !record.new && record.output_column_select !== 'custom')}
      />
      {!isNew && (
        <Select
          style={style}
          css={css}
          placeholder="Select a type"
          value={record.output_column_select ?? undefined}
          onSelect={(value) => onChangeSelect(record.index as number, value as string)}
          disabled={disabled || record.skip}
        >
          {options &&
            options.length > 0 &&
            options.map((item: RuleColumnData) => (
              <Select.Option key={item.column_name} value={item.column_name}>
                {item.column_name}
              </Select.Option>
            ))}
        </Select>
      )}
    </Space>
  );
});

export const ConvertDataType = React.memo(function ConvertDataTypeData({
  value,
  record,
  index,
  onChangeDataType,
  options,
  disabled = false,
  style,
  css,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChangeDataType: (index: number, value: string) => void;
  options: RuleOption | undefined;
  disabled: boolean;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  return (
    <Select
      style={style}
      css={css}
      placeholder="Select a type"
      value={record.data_type ?? undefined}
      onSelect={(value) => onChangeDataType(record.index as number, value as string)}
      disabled={disabled || record.skip}
    >
      {options?.data_type &&
        options.data_type.length > 0 &&
        options.data_type.map((item: string) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
});

export const ConvertDefaultValue = React.memo(function ConvertDefaultValueData({
  value,
  record,
  index,
  onChangeDefValue,
  onChangeDefType,
  options,
  style,
  css,
  disabled = false,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChangeDefValue: (index: number, value: string) => void;
  onChangeDefType: (index: number, value: string) => void;
  options: RuleOption | undefined;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
  disabled?: boolean;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChangeDefValue(index, value);
  }, 300);

  useEffect(() => {
    setText(record.def_val ?? undefined);
  }, [record.def_val]);

  return (
    <Space>
      {record.def_type !== 'lambda' && record.def_type !== 'text' ? (
        <Input style={style} css={css} value={record.def_val ?? undefined} disabled />
      ) : (
        <Input
          style={style}
          css={css}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            debouncedChange(record.index as number, e.target.value);
          }}
          disabled={disabled || record.skip}
        />
      )}
      <Select
        style={style}
        css={css}
        placeholder="Select a value"
        value={record.def_type ?? undefined}
        onSelect={(value) => onChangeDefType(record.index as number, value as string)}
        disabled={disabled || record.skip}
      >
        {options?.def_type &&
          options.def_type.length > 0 &&
          options.def_type.map((item: string) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
      </Select>
    </Space>
  );
});

// export const ConvertInputNumber = React.memo(function ConvertCoefColumnData({
//   value,
//   record,
//   index,
//   onChange,
//   keyName,
//   max,
//   min,
//   style,
//   css,
//   disabled,
// }: {
//   value?: string | null;
//   record: RuleData;
//   index?: number;
//   onChange: (index: number, num: number) => void;
//   keyName: 'coef' | 're_group' | 'row_index';
//   max?: number;
//   min?: number;
//   style?: React.CSSProperties | undefined;
//   css?: SerializedStyles;
//   disabled?: boolean;
// }) {
//   let innerDisabled = false;
//   if (keyName === 'coef') {
//     if (record.data_type) {
//       if (!convertDataTypeNumber.includes(record.data_type)) {
//         innerDisabled = true;
//       }
//     } else {
//       innerDisabled = true;
//     }
//   }

//   return (
//     <InputNumber
//       value={record[keyName] ?? undefined}
//       max={max}
//       min={min}
//       style={style}
//       css={css}
//       onChange={(num: number) => {
//         onChange(record.index as number, num);
//       }}
//       disabled={innerDisabled || disabled || record.skip}
//     />
//   );
// });

interface ConvertInputNumberForm {
  value: number | undefined;
}
export const ConvertInputNumber = React.memo(function ConvertCoefColumnData({
  value,
  record,
  index,
  onChange,
  keyName,
  max,
  min,
  style,
  css,
  disabled,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onChange: (index: number, num: number) => void;
  keyName: 'coef' | 're_group' | 'row_index';
  max?: number;
  min?: number;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
  disabled?: boolean;
}) {
  const [form] = useForm<ConvertInputNumberForm>();
  const innerDisabled = useMemo(() => {
    if (keyName === 'coef') {
      if (record.data_type) {
        if (!convertDataTypeNumber.includes(record.data_type)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }, [keyName, record.data_type]);

  const onChangeNumber = useCallback(
    (num: number) => {
      onChange(record.index as number, num);
    },
    [onChange, record.index]
  );

  const validateStatus = useMemo(() => {
    if (min === undefined && max === undefined) {
      return undefined;
    }

    const inputData = record[keyName];

    if (inputData === undefined || inputData === null) {
      return 'warning';
    }

    if (min) {
      return inputData < min ? 'error' : 'success';
    }
    if (max) {
      return inputData > max ? 'error' : 'success';
    }

    return 'success';
  }, [min, max, keyName, record]);

  return (
    <Form<ConvertInputNumberForm> form={form} layout="inline" css={convertInputNumber}>
      <Form.Item validateStatus={validateStatus}>
        <InputNumber
          max={max}
          min={min}
          value={record[keyName] ?? undefined}
          onChange={onChangeNumber}
          style={style}
          css={css}
          disabled={innerDisabled || disabled || record.skip}
        />
      </Form.Item>
    </Form>
  );
});

const convertInputNumber = css`
  .ant-form-item {
    margin-right: 0;
  }
`;

export const ConvertRegex = React.memo(function ConvertRegexData({
  value,
  record,
  index,
  onClick,
  styleProps,
  cssProps,
  disabled = false,
}: {
  value?: string | null;
  record: RuleData;
  index?: number;
  onClick: (index: number) => void;
  styleProps?: React.CSSProperties | undefined;
  cssProps?: SerializedStyles;
  disabled?: boolean;
}) {
  const isDisabled = useMemo(() => disabled || record.skip, [disabled, record.skip]);

  return (
    <div
      style={styleProps}
      css={css`
        ${cssProps}
        border: 1px solid #d9d9d9;
        height: 1.75rem;
        display: flex;
        justify-items: center;
        align-items: center;

        ${isDisabled
          ? css`
              background-color: #f5f5f5;
              color: rgba(0, 0, 0, 0.25);
              cursor: not-allowed;
            `
          : css`
              &:hover {
                border-color: #40a9ff;
              }
              &:active {
                border-right-width: 1px !important;
                outline: 0;
                box-shadow: 0 0 0 2px rgb(24, 144, 255, 20%);
              }
            `}

        .textarea {
          padding: 4px 11px 4px 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}
      onClick={
        !isDisabled
          ? () => {
              onClick(record.index as number);
            }
          : undefined
      }
    >
      <div className="textarea">{record.regex ?? undefined}</div>
    </div>
  );
});

export const ConvertDelete = React.memo(function ConvertDeleteMemo({
  record,
  onDelete,
}: {
  record: RuleData;
  onDelete: (index: number) => void;
}) {
  return (
    <Popconfirm
      title="Are you sure to delete?"
      onConfirm={() => onDelete(record.index as number)}
      disabled={record.skip}
      css={css`
        ${record.skip && 'cursor: not-allowed !important'}
      `}
    >
      <div css={convertDeleteStyle({ disabled: record.skip })}>
        <DeleteOutlined className="delete-icon" />
      </div>
    </Popconfirm>
  );
});

const convertDeleteStyle = ({ disabled = false }: { disabled?: boolean }) => css`
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${disabled
    ? css`
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.25);
      `
    : css`
        cursor: pointer;
        &:hover {
          color: ${blue[4]};
        }
        &:active {
          color: ${blue[6]};
        }
      `}
`;
