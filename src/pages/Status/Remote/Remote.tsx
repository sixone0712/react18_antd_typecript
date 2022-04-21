import { css } from '@emotion/react';
import React from 'react';
import RemoteJob from '../../../components/modules/RemoteJob';
import RemoteJobStatus from '../../../components/modules/RemoteJobStatus';
import RemoteJobStatusStep from '../../../components/modules/RemoteJobStatus/RemoteJobStatusStep';

export type RemoteJobType = 'add' | 'edit';

export type RemoteProps = {};

function Remote({}: RemoteProps) {
  return (
    <div css={style}>
      <RemoteJobStatus />
    </div>
  );
}

type StepsProps = {};

function Steps({}: StepsProps) {
  return (
    <div css={style}>
      <RemoteJobStatusStep />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

type AddJobProps = {};

function AddJob({}: AddJobProps) {
  return (
    <div>
      <RemoteJob type={'add'} />
    </div>
  );
}

type EditJobProps = {};

function EditJob({}: EditJobProps) {
  return (
    <div>
      <RemoteJob type={'edit'} />
    </div>
  );
}

Remote.Steps = Steps;
Remote.AddJob = AddJob;
Remote.EditJob = EditJob;
export default Remote;
