export type PipelineStatus = 'success' | 'running' | 'failed' | 'pending';

export interface PipelineNode {
  id: string;
  label: string;
  sublabel?: string;
  status: PipelineStatus;
  icon?: string;
}

export interface PipelineRun {
  id: string;
  dagName: string;
  status: PipelineStatus;
  startTime: string;
  duration: string;
  recordsProcessed: number;
  nextRun?: string;
}

export interface PipelineStats {
  lastSuccessful: string;
  failedToday: number;
  totalRecordsToday: number;
  avgDuration: string;
  successRate: number;
}

