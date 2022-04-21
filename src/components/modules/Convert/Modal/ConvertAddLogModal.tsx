import { Form, InputNumber, Modal, Space, Switch } from 'antd';
import React from 'react';
import useConvertAdd from '../../../../hooks/useConvertAdd';
import FormInput from '../../../atoms/CustomForm/FormInput';
import FormSelect from '../../../atoms/CustomForm/FormSelect';
import FormTag from '../../../atoms/CustomForm/FormTag';

export const ruleTypeOption = [
  {
    key: 'csv',
    value: 'csv',
    label: 'CSV',
  },
  {
    key: 'regex',
    value: 'regex',
    label: 'Regular Expression',
  },
];
export default function ConvertAddLogModal(): JSX.Element {
  const {
    form,
    handleOk,
    handleCancel,
    isFetchingAdd,
    siteNameList,
    visible,
    tag,
    setTag,
    ignore,
    setIgnore,
    isRetention,
    setRetention,
  } = useConvertAdd();

  return (
    <Modal
      title={'Add Log'}
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetchingAdd, disabled: isFetchingAdd }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetchingAdd,
      }}
      closable={!isFetchingAdd}
      maskClosable={!isFetchingAdd}
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormInput label="Log Name" name="log_name" required disabled={isFetchingAdd} />
        <FormInput label="Table Name" name="table_name" required disabled={isFetchingAdd} />
        <FormSelect
          label="Rule Type"
          name="rule_type"
          placeholder="Select a rule type."
          options={ruleTypeOption}
          ObjkeyName={'key'}
          ObjvalueName={'value'}
          ObjLabelName={'label'}
          disabled={isFetchingAdd}
          required
        />
        <FormSelect
          label="User-Fab Name"
          name="select"
          options={siteNameList}
          ObjkeyName="siteId"
          ObjvalueName="siteId"
          ObjLabelName="crasCompanyFabName"
          disabled={isFetchingAdd}
          required={false}
          mode="multiple"
          placeholder="All (If you select nothing, it will run on all user-fabs.)"
          tooltip="If you select nothing, it will run on all user-fabs."
        />
        <FormTag label="Tags" name="tag" tag={tag} setTag={setTag} />
        <FormTag label="Ignore Pattern" name="ignore" tag={ignore} setTag={setIgnore} />
        <Form.Item
          label={
            <Space>
              <div>Retention Period (Days)</div>
              <Switch checked={isRetention} onChange={setRetention} />
            </Space>
          }
          name="retention"
          required
          rules={[
            {
              required: isRetention,
              message: `Please input Retention Period!`,
            },
            {
              required: isRetention,
              message: `The value must be greater than 1!`,
              type: 'number',
              validator: (rule, value) =>
                new Promise((resolve, reject) => {
                  if (!value) return resolve(true);
                  return +value >= 1 ? resolve(true) : reject(false);
                }),
            },
          ]}
        >
          <InputNumber min={1} disabled={!isRetention} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
