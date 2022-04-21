import { Form, Modal } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import useCrasDataAdd from '../../../hooks/useCrasDataAdd';
import FormSelectMultiple from '../../atoms/CustomForm/FormSelectMultiple';

export default function CrasDataAddModal(): JSX.Element {
  const { form, handleOk, handleCancel, isFetchingNames, isFetchingAdd, data, visible } = useCrasDataAdd();

  return (
    <Modal
      title={'Add Cras Data'}
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetchingAdd, disabled: isFetchingAdd || isFetchingNames }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetchingAdd,
      }}
      closable={!isFetchingAdd}
      maskClosable={!isFetchingAdd}
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormSelectMultiple
          label="User-Fab Name"
          name="siteId"
          options={data}
          ObjkeyName="siteId"
          ObjvalueName="siteId"
          ObjLabelName="name"
          disabled={isFetchingNames || isFetchingAdd}
          loading={isFetchingNames}
          required
          placeholder="Select User-Fab Name"
        />
        <Form.Item label="Legacy Database" name="legacy" valuePropName="checked" required>
          <Checkbox>Migration</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
