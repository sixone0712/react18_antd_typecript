import { Form, InputNumber, Modal, Space, Switch } from 'antd';
import React from 'react';
import useConvertEditModal from '../../../../hooks/useConvertEditModal';
import FormReadOnly from '../../../atoms/CustomForm/FormReadOnly';
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
export default function ConvertEditLogModal(): JSX.Element {
  const {
    form,
    handleOk,
    handleCancel,
    isFetchingEdit,
    isFecthingBase,
    siteNameList,
    ruleList,
    visible,
    tag,
    setTag,
    ignore,
    setIgnore,
    isRetention,
    setRetention,
  } = useConvertEditModal();

  return (
    <Modal
      title={'Edit Log'}
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetchingEdit, disabled: isFetchingEdit }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetchingEdit,
      }}
      closable={!isFetchingEdit}
      maskClosable={!isFetchingEdit}
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormReadOnly label="Log Name" name="log_name" required loading={isFecthingBase} />
        <FormReadOnly label="Table Name" name="table_name" required loading={isFecthingBase} />
        <FormSelect
          label="Rule Type"
          name="rule_type"
          placeholder="Select a rule type."
          options={ruleTypeOption}
          ObjkeyName={'key'}
          ObjvalueName={'value'}
          ObjLabelName={'label'}
          labelInValue
          disabled={true}
          required
          loading={isFecthingBase}
        />
        <FormSelect
          label="Registered Rules"
          name="rule_list"
          options={ruleList}
          ObjkeyName="id"
          ObjvalueName="id"
          ObjLabelName={['rule_name', 'col']}
          disabled={isFetchingEdit || isFecthingBase}
          loading={isFecthingBase}
          required={false}
          mode="multiple"
          placeholder="No registered rules"
          tooltip="Unselected rules are deleted."
        />
        <FormSelect
          label="User-Fab Name"
          name="select"
          options={siteNameList}
          ObjkeyName="siteId"
          ObjvalueName="siteId"
          ObjLabelName="crasCompanyFabName"
          disabled={isFetchingEdit || isFecthingBase}
          loading={isFecthingBase}
          required={false}
          mode="multiple"
          placeholder="All (If you select anything, it will run on all user-fabs.)"
          tooltip="If you select anything, it will run on all user-fabs."
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
