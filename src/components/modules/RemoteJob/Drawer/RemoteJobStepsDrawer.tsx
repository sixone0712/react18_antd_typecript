import { css } from '@emotion/react';
import { Button, Drawer, Form, FormInstance, Space } from 'antd';
import React from 'react';
import useRemoteJobStepsDrawer, { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import { convertRemToPixels } from '../../../../lib/util/remToPixcels';
import RemoteJobStepsDrawerBefore from './RemoteJobStepsDrawerBefore';
import RemoteJobStepsDrawerCommon from './RemoteJobStepsDrawerCommon';
import RemoteJobStepsDrawerEmail from './RemoteJobStepsDrawerEmail';
import RemoteJobStepsDrawerExcute from './RemoteJobStepsDrawerExcute';
import RemoteJobStepsDrawerRules from './RemoteJobStepsDrawerRules';
import RemoteJobStepsDrawerScript from './RemoteJobStepsDrawerScript';

export type RemoteJobStepsDrawerProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

export default function RemoteJobStepsDrawer({ form }: RemoteJobStepsDrawerProps): JSX.Element {
  const { visible, onCloseDrawer, itemVisible, onSubmit, type } = useRemoteJobStepsDrawer({ form });

  return (
    <Drawer
      title={type === 'add' ? 'Add Step' : ' Edit Step'}
      placement="right"
      width={convertRemToPixels(67.25)}
      closable={true}
      onClose={onCloseDrawer}
      visible={visible}
      destroyOnClose
      // getContainer={false}
      forceRender
      css={style}
      extra={
        <Space>
          {/* <Button onClick={() => console.log(form.getFieldsValue())}>Show Form</Button> */}
          <Button onClick={onCloseDrawer}>Cancel</Button>
          <Button onClick={onSubmit} type="primary">
            Ok
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="horizontal" hideRequiredMark>
        {visible && (
          <>
            <RemoteJobStepsDrawerCommon form={form} />
            {itemVisible.isExcuteMode && <RemoteJobStepsDrawerExcute form={form} />}
            {itemVisible.isEmail && <RemoteJobStepsDrawerEmail form={form} />}
            {itemVisible.isBefore && <RemoteJobStepsDrawerBefore form={form} />}
            {itemVisible.isJudgeRules && <RemoteJobStepsDrawerRules form={form} />}
            {itemVisible.isScript && <RemoteJobStepsDrawerScript form={form} />}
          </>
        )}
      </Form>
    </Drawer>
  );
}

const style = css``;
