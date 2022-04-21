import { css } from '@emotion/react';
import { Badge } from 'antd';
import React from 'react';
import {
  selectRemoteJobInfo,
  selectRemoteJobStepRules,
  selectRemoteJobSteps,
} from '../../../reducers/slices/remoteJob';
import useTypedSelector from '../../../reducers/useTypedSelector';
import { RemoteJobStepDetailState, TransferRemoteJobJudgeRule } from '../../../types/Job';
import PopupTip from '../../atoms/PopupTip';
import { convertStepType } from './Drawer/RemoteJobStepsDrawerCommon';

export type RemoteJobCheckProps = {};
export default function RemoteJobCheck({}: RemoteJobCheckProps): JSX.Element {
  const jobInfo = useTypedSelector(selectRemoteJobInfo);
  const steps = useTypedSelector(selectRemoteJobSteps);
  const rules = useTypedSelector(selectRemoteJobStepRules);

  return (
    <div css={style}>
      <div className="job-name">
        <div className="name">
          <Badge color="blue" />
          <span>Job Name</span>
        </div>
        <div className="value">{jobInfo.jobName}</div>
      </div>
      <div className="user-fab-name">
        <div className="name">
          <Badge color="blue" />
          <span>User-Fab Name</span>
        </div>
        <div className="value">{jobInfo.siteName}</div>
      </div>
      <div className="select-plans">
        <div className="name">
          <Badge color="blue" />
          <span>Select Plans</span>
        </div>
        <div className="value">{jobInfo.planIds.length} Plans</div>
      </div>
      <div className="steps">
        <div className="name">
          <Badge color="blue" />
          <span>Steps</span>
        </div>
        <div className="value">
          {steps.map((item) => (
            <div
              css={css`
                margin-bottom: 1rem;
              `}
              key={item.uuid}
            >
              <StepsCheck step={item} steps={steps} rules={rules} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type StepsCheckProps = {
  step: RemoteJobStepDetailState;
  steps: RemoteJobStepDetailState[];
  rules: TransferRemoteJobJudgeRule[];
};
function StepsCheck({ step, steps, rules }: StepsCheckProps) {
  if (step.stepType === 'collect') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
        </div>
      </div>
    );
  }

  if (step.stepType === 'convert') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
        </div>
      </div>
    );
  }

  if (step.stepType === 'summary') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
          <StepsCheckRecipients step={step} />
          <div>{`Before ${step.before ?? 0} Days`}</div>
        </div>
      </div>
    );
  }

  if (step.stepType === 'cras') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
          <StepsCheckRecipients step={step} />
          <div>{`Before ${step.before ?? 0} Days`}</div>
          <div>{`${step.selectJudgeRules?.length ?? 0} / ${rules?.length ?? 0} Judge Ruels`}</div>
        </div>
      </div>
    );
  }

  if (step.stepType === 'version') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
          <StepsCheckRecipients step={step} />
          <div>{`Before ${step.before ?? 0} Days`}</div>
        </div>
      </div>
    );
  }

  if (step.stepType === 'purge') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
        </div>
      </div>
    );
  }

  if (step.stepType === 'notice') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckRecipients step={step} />
        </div>
      </div>
    );
  }

  if (step.stepType === 'custom') {
    return (
      <div className="sub-item">
        <div className="sub-item-name" title={step.stepName as string}>
          {step.stepName}
        </div>
        <div className="sub-item-value">
          <div>{convertStepType(step.stepType)}</div>
          <StepsCheckExcuteMode step={step} steps={steps} />
          {step.isEmail && <StepsCheckRecipients step={step} />}
        </div>
      </div>
    );
  }

  return <></>;
}

function StepsCheckExcuteMode({ step, steps }: { step: RemoteJobStepDetailState; steps: RemoteJobStepDetailState[] }) {
  if (step.mode === 'time') {
    return <div>{`Specified Time / ${step.time.join(', ')}`}</div>;
  }

  if (step.mode === 'cycle') {
    return <div>{`Cycle / ${step.period} ${step.cycle}`}</div>;
  }

  if (step.mode === 'pre') {
    return <div>{`Previous / ${steps.find((item) => item.uuid === step.preStep)?.stepName ?? ''}`}</div>;
  }

  if (step.mode === 'next') {
    return <div>{`Next / ${steps.find((item) => item.uuid === step.nextStep)?.stepName ?? ''}`}</div>;
  }

  return <></>;
}

function StepsCheckRecipients({ step }: { step: RemoteJobStepDetailState }) {
  if (step.emailBook.length > 0 || step.groupBook.length > 0 || step.customEmails.length > 0) {
    const recipients = [
      ...step.groupBook.map((item) => `@${item.name}`),
      ...step.emailBook.map((item) => item.email),

      ...step.customEmails,
    ];

    return (
      <div>
        <PopupTip
          value={`${recipients.length} Recipients`}
          list={recipients.map((item) => item)}
          placement="right"
          color="blue"
        />
      </div>
    );
  } else {
    return <></>;
  }
}

const style = css`
  font-size: 1rem;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  .job-name,
  .user-fab-name,
  .select-plans,
  .steps {
    display: flex;
    .name {
      width: 14rem;
    }
    .value {
      display: flex;
      flex-direction: column;
      width: 49.125rem;
      .sub-item {
        display: flex;
        width: 49.125rem;
        .sub-item-name {
          width: 13rem;
          margin-right: 2rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .sub-item-value {
          width: 34.125rem;
        }
      }
    }
    margin-bottom: 1rem;
  }
`;
