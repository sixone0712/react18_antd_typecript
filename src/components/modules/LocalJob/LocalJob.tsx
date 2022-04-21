import { AppstoreOutlined, ControlOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Col, PageHeader, Row, Space } from 'antd';
import React from 'react';
import useLocalJob from '../../../hooks/localJob/useLocalJob';
import { LOCAL_JOB_STEP } from '../../../types/Job';
import CustomIcon from '../../atoms/CustomIcon';
import SideSteps from '../../atoms/SideSteps/SideSteps';
import StepButton from '../../atoms/StepButton';
import LocalConfigure from './LocalJobConfigure';
import LocalJobCheck from './LocalJobCheck';
import LocalJobOther from './LocalJobOther';

export type LocalJobProps = {};
export default function LocalJob(): JSX.Element {
  const { current, setCurrent, onNextAction, onBack, disabledNext } = useLocalJob();

  return (
    <Container>
      <PageHeader onBack={onBack} title="Add Local Job Setting" />
      <Contents>
        <SideSteps current={current} stepList={localStepList} />
        <Settings>
          <SettingsTitle justify="space-between" align="middle">
            <Title current={current} />
            <StepButton
              current={current}
              setCurrent={setCurrent}
              lastStep={LOCAL_JOB_STEP.CHECK}
              nextActionPromise={onNextAction}
              disabled={disabledNext}
            />
          </SettingsTitle>
          <Main>
            {current === LOCAL_JOB_STEP.CONFIGURE && <LocalConfigure />}
            {current === LOCAL_JOB_STEP.OTHER && <LocalJobOther />}
            {current >= LOCAL_JOB_STEP.CHECK && <LocalJobCheck />}
          </Main>
        </Settings>
      </Contents>
    </Container>
  );
}

interface TitleProps {
  current: number;
}
function Title({ current }: TitleProps) {
  const { icon, text } = getTitle(current);

  return (
    <Space>
      {icon}
      <span>{text}</span>
    </Space>
  );
}

function getTitle(current: number) {
  switch (current) {
    case LOCAL_JOB_STEP.CONFIGURE:
      return {
        icon: <ControlOutlined />,
        text: 'Configure',
      };
    case LOCAL_JOB_STEP.OTHER:
      return {
        icon: <AppstoreOutlined />,
        text: 'Other Settings',
      };
    case LOCAL_JOB_STEP.CHECK:
    default:
      return {
        icon: <CustomIcon name="check_setting" />,
        text: 'Check Settings',
      };
  }
}

const Container = styled(Row)`
  /* display: flex; */
  flex-direction: column;
  background-color: white;
  width: inherit;
`;

const Contents = styled(Row)`
  /* display: flex; */
  margin-left: 1.75rem;
  margin-right: 1.75rem;
  margin-top: 1.875rem;
  flex-wrap: nowrap;
  /* flex-direction: row; */
`;

const SettingsTitle = styled(Row)`
  margin-left: 1rem;
  font-size: 1.125rem;
`;

const Main = styled(Col)`
  padding-top: 2.125rem;
  margin-left: 3rem;
`;

const Settings = styled(Col)`
  width: 67.1875rem;
`;

export const localStepList = ['Configure', 'Other', 'Check'];
