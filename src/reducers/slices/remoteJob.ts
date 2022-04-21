import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  RemoteJobDetailState,
  RemoteJobStepDetailState,
  RemoteJobStepKeyState,
  TransferRemoteJobJudgeRule,
} from '../../types/Job';
import { RootState } from '../rootReducer';
export interface RemoteJobReduxState {
  job: RemoteJobDetailReduxState;
  steps: RemoteJobStepDetailState[];
  visible: RemoteJobVisibleReduixState;
  rules: TransferRemoteJobJudgeRule[];
}

export interface RemoteJobVisibleReduixState {
  isAddStep: boolean;
  isStep: boolean;
  isScript: boolean;
  isJudgeRules: boolean;
  isAddrBook: boolean;
  isMileStone: boolean;
  isImportScript: boolean;
}
export interface RemoteJobDetailReduxState extends Omit<RemoteJobDetailState, 'steps'> {}

const initialJobState: RemoteJobDetailReduxState = {
  jobId: null,
  jobName: null,
  siteId: null,
  siteName: null,
  planIds: [],
};

const initialState: RemoteJobReduxState = {
  job: initialJobState,
  steps: [],
  visible: {
    isAddStep: false,
    isStep: false,
    isScript: false,
    isJudgeRules: false,
    isAddrBook: false,
    isMileStone: false,
    isImportScript: false,
  },

  rules: [],
};

const remoteJob = createSlice({
  name: 'remoteJob',
  initialState,
  reducers: {
    remoteJobInitReducer: () => initialState,
    remoteJobInfoReducer: (state, action: PayloadAction<Partial<RemoteJobDetailState>>) => {
      state.job = {
        ...state.job,
        ...action.payload,
      };
    },
    remoteStepsInfoReducer: (state, action: PayloadAction<RemoteJobStepDetailState[]>) => {
      state.steps = action.payload;
    },
    remoteJobAddStepsInfoReducer: (state, action: PayloadAction<RemoteJobStepDetailState>) => {
      state.steps.push(action.payload);
    },
    remoteJobStepsInfoReducer: (state, action: PayloadAction<RemoteJobStepDetailState>) => {
      const { uuid } = action.payload;

      if (uuid) {
        // edit
        const findIndex = state.steps.findIndex((item) => item.uuid === uuid);
        if (findIndex !== -1) {
          state.steps[findIndex] = {
            ...state.steps[findIndex],
            ...action.payload,
          };
        }
      } else {
        // add
        state.steps.push({
          ...action.payload,
          uuid: uuidv4(),
        });
      }
    },
    remoteJobDeleteStepsInfoReducer: (state, action: PayloadAction<string>) => {
      const findIndex = state.steps.findIndex((item) => item.uuid === action.payload);
      if (findIndex !== -1) {
        state.steps.splice(findIndex, 1);
        state.steps.forEach((item, idx) => {
          if (item.preStep === action.payload) {
            state.steps[idx].preStep = null;
            // state.steps[idx].mode = 'none';
          }
        });
      }
    },
    remoteJobStepsEnableReducer: (state, action: PayloadAction<string[]>) => {
      state.steps.forEach((item, idx) => {
        state.steps[idx].enable = action.payload.includes(item.uuid as string) ? true : false;
      });
    },
    remoteJobVisibleReducer: (state, action: PayloadAction<Partial<RemoteJobVisibleReduixState>>) => {
      state.visible = {
        ...state.visible,
        ...action.payload,
      };
    },
    remoteJobStepRulesReducer: (state, action: PayloadAction<TransferRemoteJobJudgeRule[]>) => {
      state.rules = action.payload;
    },
  },
});

export const {
  remoteJobInitReducer,
  remoteJobInfoReducer,
  remoteStepsInfoReducer,
  remoteJobAddStepsInfoReducer,
  remoteJobStepsInfoReducer,
  remoteJobDeleteStepsInfoReducer,
  remoteJobStepsEnableReducer,
  remoteJobVisibleReducer,
  remoteJobStepRulesReducer,
} = remoteJob.actions;

export const selectRemoteJobInfo = (state: RootState) => state.remoteJob.job;
export const selectRemoteJobSteps = (state: RootState) => state.remoteJob.steps;

export const selectRemoteJobStepKeys = createSelector<RootState, RemoteJobStepDetailState[], RemoteJobStepKeyState[]>(
  selectRemoteJobSteps,
  (state) => state.map((item) => ({ uuid: item.uuid, stepName: item.stepName }))
);

export const selectRemoteJobStep = (stepId: number) => (state: RootState) => state.remoteJob.steps[stepId];
export const selectRemoteJobStepsEnable = createSelector(selectRemoteJobSteps, (steps) => {
  return steps.filter((item) => item.enable).map((item) => item.uuid);
});
export const selectRemoteJobAllVisible = (state: RootState) => state.remoteJob.visible;
export const selectRemoteJobVisible = (name: keyof RemoteJobVisibleReduixState) =>
  createSelector<RootState, RemoteJobVisibleReduixState, boolean>(
    selectRemoteJobAllVisible,
    (state) => state[name] ?? false
  );
export const selectRemoteJobStepRules = (state: RootState) => state.remoteJob.rules;
export default remoteJob.reducer;
