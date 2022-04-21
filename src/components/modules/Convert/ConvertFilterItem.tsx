import { css, SerializedStyles } from '@emotion/react';
import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce/lib';
import { RuleFilterData, RuleOption } from '../../../types/convertRules';
import { convertRegexValidate } from './ConvertDefineTableItem';

// export const ConvertFilterName = React.memo(function ConvertFilterNameData({
//   value,
//   record,
//   index,
//   onChange,
//   style,
//   css,
// }: {
//   value?: string | null;
//   record: RuleFilterData;
//   index?: number;
//   onChange: (index: number, value: string) => void;
//   style?: React.CSSProperties | undefined;
//   css?: SerializedStyles;
// }) {
//   const [text, setText] = useState<string | undefined>();

//   const debouncedChange = useDebouncedCallback((index: number, value: string) => {
//     onChange(index, value);
//   }, 300);

//   useEffect(() => {
//     setText(record.name ?? undefined);
//   }, [record.name]);

//   return (
//     <Input
//       value={text}
//       css={css}
//       style={style}
//       onChange={(e) => {
//         setText(e.target.value);
//         debouncedChange(record.index as number, e.target.value);
//       }}
//     />
//   );
// });

interface ConvertFilterNameForm {
  value: string | undefined;
}

export const ConvertFilterName = React.memo(function ConvertFilterNameData({
  value,
  record,
  index,
  onChange,
  style,
  css,
  regex,
}: {
  value?: string | null;
  record: RuleFilterData;
  index?: number;
  onChange: (index: number, value: string) => void;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
  regex?: RegExp;
}) {
  const [form] = useForm<ConvertFilterNameForm>();
  const [input, setInput] = useState<string | undefined>(undefined);
  const debouncedChange = useDebouncedCallback((index: number, value: string | null) => {
    onChange(index, value as string);
  }, 300);

  const onValuesChange = (input: ConvertFilterNameForm) => {
    setInput(input.value);
    debouncedChange(record.index as number, input.value ?? null);
  };

  const validateStatus = useMemo(() => (regex ? convertRegexValidate(input, regex) : undefined), [input, regex]);

  useEffect(() => {
    const value = record.name ?? undefined;
    form.setFieldsValue({
      value,
    });
    setInput(value);
  }, [record.name, form]);

  return (
    <Form<ConvertFilterNameForm>
      form={form}
      onValuesChange={onValuesChange}
      layout="inline"
      css={convertFilterNameStyle}
    >
      <Form.Item name="value" validateStatus={validateStatus}>
        <Input css={css} style={style} />
      </Form.Item>
    </Form>
  );
});

const convertFilterNameStyle = css`
  .ant-form-item {
    margin-right: 0;
  }
`;

export const ConvertFilterType = React.memo(function ConvertFilterTypeData({
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
  record: RuleFilterData;
  index?: number;
  onChangeDataType: (index: number, value: string) => void;
  options: RuleOption | undefined;
  disabled?: boolean;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  return (
    <Select
      style={style}
      css={css}
      placeholder="Select a type"
      value={record.type ?? undefined}
      onSelect={(value) => onChangeDataType(record.index as number, value as string)}
      disabled={disabled}
    >
      {options?.filter_type &&
        options.filter_type.length > 0 &&
        options.filter_type.map((item: string) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
});

export const ConvertFilterCondition = React.memo(function ConvertFilterConditionData({
  value,
  record,
  index,
  onChange,
  style,
  css,
}: {
  value?: string | null;
  record: RuleFilterData;
  index?: number;
  onChange: (index: number, value: string) => void;
  style?: React.CSSProperties | undefined;
  css?: SerializedStyles;
}) {
  const [text, setText] = useState<string | undefined>();

  const debouncedChange = useDebouncedCallback((index: number, value: string) => {
    onChange(index, value);
  }, 300);

  useEffect(() => {
    setText(record.condition ?? undefined);
  }, [record.condition]);

  return (
    <Input
      value={text}
      css={css}
      style={style}
      onChange={(e) => {
        setText(e.target.value);
        debouncedChange(record.index as number, e.target.value);
      }}
    />
  );
});
