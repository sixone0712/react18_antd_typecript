import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobStatusType, JobStepType, JobType } from '../../types/Job';
import { RootState } from '../rootReducer';

export interface BuildHistorySelectedLogState {
  id: string | null;
  status: JobStatusType | null;
  name: string | null;
}

export interface BuildHistorySelectedStepState {
  jobId: string | null;
  type: JobType | null;
  stepType: JobStepType | null;
  stepId: string | null;
  jobName: string | null;
  stepName: string | null;
  historyId: string | null;
}

export interface BuildHistoryReduxState {
  selectedStep: BuildHistorySelectedStepState;
  selectedLog: BuildHistorySelectedLogState;
  currentPage: number;
}

const initialState: BuildHistoryReduxState = {
  selectedStep: {
    jobId: null,
    type: null,
    stepType: null,
    stepId: null,
    jobName: null,
    stepName: null,
    historyId: null,
  },
  selectedLog: {
    id: null,
    status: null,
    name: null,
  },
  currentPage: 1,
};

const buildHistory = createSlice({
  name: 'buildHistory',
  initialState,
  reducers: {
    historyInitReducer: () => initialState,
    historyReducer(state, action: PayloadAction<Partial<BuildHistoryReduxState>>) {
      state = {
        ...state,
        ...action.payload,
      };
    },
    historySelectStepReudcer(state, action: PayloadAction<Partial<BuildHistorySelectedStepState>>) {
      state.selectedStep = {
        ...state.selectedStep,
        ...action.payload,
      };
    },
    historySelectLogReducer(state, action: PayloadAction<Partial<BuildHistorySelectedLogState>>) {
      state.selectedLog = {
        ...state.selectedLog,
        ...action.payload,
      };
    },
    historyCurPageReducer(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  historyInitReducer,
  historyReducer,
  historySelectStepReudcer,
  historySelectLogReducer,
  historyCurPageReducer,
} = buildHistory.actions;

export const selectHistory = (state: RootState) => state.buildHistory;
export const selectHistorySelectStep = (state: RootState) => state.buildHistory.selectedStep;
export const selectHistorySelectLog = (state: RootState) => state.buildHistory.selectedLog;
export const selectHistoryCurPage = (state: RootState) => state.buildHistory.currentPage;

export default buildHistory.reducer;
