import { css } from '@emotion/react';
import { Form, FormInstance, Input } from 'antd';
import React from 'react';
import { FormConvertHeadersColumns } from '../../../hooks/useConvertEdit';
import useConvertLog from '../../../hooks/useConvertLog';
import FormReadOnly from '../../atoms/CustomForm/FormReadOnly';
import FormSelect from '../../atoms/CustomForm/FormSelect';

export type ConvertDefineTableLogProps = {
  form: FormInstance<FormConvertHeadersColumns>;
};

function ConvertDefineTableLog({ form }: ConvertDefineTableLogProps): JSX.Element {
  const {
    onChangeEditRuleName,
    onChangeRuleBase,
    onClearRuleBase,
    newRule,
    rule_type,
    ruleList,
    isFetching,
  } = useConvertLog({
    form,
  });
  return (
    <div css={style}>
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <div className="log-define-first">
          <FormReadOnly label="Log Name" name="log_name" formClassName="log-name" required />
          <FormReadOnly label="Table Name" name="table_name" formClassName="table-name" required />
        </div>
        <div className="log-define-second">
          <Form.Item
            label="Rule Name"
            name="edit_rule_name"
            className="rule-name"
            required
            rules={[
              {
                required: true,
                message: `Please input rule name!`,
              },
            ]}
          >
            <Input onChange={onChangeEditRuleName} />
          </Form.Item>
          {newRule && rule_type === 'csv' && (
            <FormSelect
              label="Rule Base"
              name="select_rule_base"
              formClassName="rule-base"
              placeholder="Select a rule base."
              options={ruleList ?? []}
              ObjkeyName={'id'}
              ObjvalueName={'id'}
              ObjLabelName={['rule_name', 'col']}
              loading={isFetching}
              disabled={isFetching}
              onSelect={onChangeRuleBase}
              required={false}
              allowClear
              onClear={onClearRuleBase}
            />
          )}
        </div>
      </Form>
    </div>
  );
}

export default React.memo(ConvertDefineTableLog);

const style = css`
  display: flex;
  flex-direction: column;
  .log-define-first,
  .log-define-second {
    display: flex;
    .ant-form-item {
      width: 30rem;
    }
    .table-name,
    .rule-base {
      margin-left: 3rem;
    }
  }
`;
