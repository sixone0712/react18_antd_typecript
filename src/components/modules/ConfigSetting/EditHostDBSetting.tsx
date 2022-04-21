import React from 'react';
import { css } from '@emotion/react';
import { Button, Drawer, Form, Input } from 'antd';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';
import { ReqPostHostDBInfo, ResGetHostDBInfo } from '../../../lib/api/axios/types';
import { regExpIpAddress } from '../../../lib/util/validation';

export type EditHostDBSettingProps = {
  visible: boolean;
  close: () => void;
  data: ResGetHostDBInfo | undefined;
  apply: (data: ReqPostHostDBInfo) => void;
  applying: boolean;
};

export default function EditHostDBSetting({
  visible,
  close,
  data,
  apply,
  applying,
}: EditHostDBSettingProps): JSX.Element {
  return (
    <Drawer
      title="Edit Settings DataBase Info."
      placement="right"
      width={convertRemToPixels(18.75)}
      closable={true}
      onClose={close}
      visible={visible}
    >
      <Form
        onFinish={(values) => {
          apply(values);
        }}
        onFinishFailed={() => {}}
        layout="vertical"
        initialValues={{
          address: data?.address,
          port: data?.port,
          user: data?.user,
          password: data?.password,
        }}
      >
        <Form.Item
          label="IP Address"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input ip address!',
              pattern: regExpIpAddress(),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Port"
          name="port"
          rules={[
            {
              required: true,
              message: 'Please input a port!',
              type: 'number',
              validator: (rule, value) =>
                new Promise((resolve, reject) => (value >= 0 && value <= 65535 ? resolve(true) : reject(false))),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="User" name="user" rules={[{ required: true, message: 'Please input a user!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input a password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" css={applyBtnstyle} loading={applying}>
            Apply
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

const applyBtnstyle = css`
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 1rem;
`;
