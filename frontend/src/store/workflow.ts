import { create } from 'zustand';
import type { Workflow, Execution } from '../types/workflow';

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  setWorkflows: (workflows: Workflow[]) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  updateWorkflow: (workflow: Workflow) => void;
  removeWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: [],
  currentWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setCurrentWorkflow: (currentWorkflow) => set({ currentWorkflow }),
  updateWorkflow: (workflow) =>
    set((state) => ({
      workflows: state.workflows.map((w) => (w._id === workflow._id ? workflow : w)),
      currentWorkflow: state.currentWorkflow?._id === workflow._id ? workflow : state.currentWorkflow,
    })),
  removeWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w._id !== id),
      currentWorkflow: state.currentWorkflow?._id === id ? null : state.currentWorkflow,
    })),
}));

interface ExecutionStore {
  executions: Execution[];
  currentExecution: Execution | null;
  setExecutions: (executions: Execution[]) => void;
  setCurrentExecution: (execution: Execution | null) => void;
  addExecution: (execution: Execution) => void;
  updateExecution: (execution: Execution) => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  executions: [],
  currentExecution: null,
  setExecutions: (executions) => set({ executions }),
  setCurrentExecution: (currentExecution) => set({ currentExecution }),
  addExecution: (execution) =>
    set((state) => ({
      executions: [execution, ...state.executions],
    })),
  updateExecution: (execution) =>
    set((state) => ({
      executions: state.executions.map((e) => (e._id === execution._id ? execution : e)),
      currentExecution: state.currentExecution?._id === execution._id ? execution : state.currentExecution,
    })),
}));
