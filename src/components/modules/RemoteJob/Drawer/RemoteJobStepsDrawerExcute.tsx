import { css } from '@emotion/react';
import { Form, FormInstance, InputNumber, Radio, Select, Space, TimePicker } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsDrawerExcute from '../../../../hooks/remoteJob/useRemoteJobStepsDrawerExcute';
import MarkUpTags from '../../../atoms/MarkupTags';
import { StepCommonLabel, StepEmptyLable } from './RemoteJobStepsDrawerCommon';

export type RemoteJobStepsDrawerExcuteProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

const ENABLE_EXCUTE_MODE_NEXT = false;
export default function RemoteJobStepsDrawerExcute({ form }: RemoteJobStepsDrawerExcuteProps): JSX.Element {
  const {
    excuteMode,
    setExcuteMode,
    timeMoment,
    onChangeTimeMoment,
    time,
    onChangeTime,
    stepUuids,
    uuid,
  } = useRemoteJobStepsDrawerExcute({ form });

  return (
    <div css={style}>
      <Form.Item label={<StepCommonLabel label="Excute Mode" />} name="mode" colon={false}>
        <Radio.Group onChange={setExcuteMode}>
          <Radio value="time">Specified Time</Radio>
          <Radio value="cycle">Cycle</Radio>
          <Radio value="pre">Previous</Radio>
          {ENABLE_EXCUTE_MODE_NEXT && <Radio value="next">Next</Radio>}
          <Radio value="none">None</Radio>
        </Radio.Group>
      </Form.Item>

      {excuteMode === 'cycle' && (
        <Form.Item label={<StepEmptyLable />} colon={false}>
          <Form.Item name="period" className="period" rules={[{ required: true, message: 'Please input a cycle!' }]}>
            <InputNumber
              min={1}
              max={999}
              addonAfter={
                <Form.Item name="cycle" noStyle>
                  <Select className="select-value">
                    <Select.Option value="minute">Miniute</Select.Option>
                    <Select.Option value="hour">Hour</Select.Option>
                    <Select.Option value="day">Day</Select.Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
        </Form.Item>
      )}
      {excuteMode === 'time' && (
        <Form.Item
          label={<StepEmptyLable />}
          name="time"
          colon={false}
          rules={[{ required: true, message: 'Please input times!' }]}
        >
          <Space direction="vertical">
            <TimePicker value={timeMoment} format="HH:mm" onChange={onChangeTimeMoment} />
            <MarkUpTags tags={time} setTags={onChangeTime} />
          </Space>
        </Form.Item>
      )}
      {excuteMode === 'pre' && (
        <Form.Item label={<StepEmptyLable />} colon={false}>
          <Form.Item
            name="preStep"
            className="preStep"
            rules={[{ required: true, message: 'Please select a previous step!' }]}
          >
            <Select className="select-value">
              {stepUuids
                .filter((item) => item.uuid !== uuid)
                .map((item) => (
                  <Select.Option key={item.uuid as string} value={item.uuid as string}>
                    {item.stepName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form.Item>
      )}
      {ENABLE_EXCUTE_MODE_NEXT && excuteMode === 'next' && (
        <Form.Item label={<StepEmptyLable />} colon={false}>
          <Space>
            <Form.Item
              name="nextStep"
              className="nextStep"
              rules={[{ required: true, message: 'Please select a next step!' }]}
            >
              <Select className="select-value">
                {stepUuids
                  .filter((item) => item.uuid !== uuid)
                  .map((item) => (
                    <Select.Option key={item.uuid as string} value={item.uuid as string}>
                      {item.stepName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>
      )}
    </div>
  );
}

const style = css`
  .period {
    width: 11.75rem;
    .select-value {
      width: 6.25rem;
    }
  }

  .preStep,
  .nextStep {
    .select-value {
      width: 15.625rem;
    }
  }

  .ant-form-item-explain {
    width: 53rem;
  }
`;
