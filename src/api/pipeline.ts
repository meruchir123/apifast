import { simulateDelay } from './client';
import {
  MOCK_PIPELINE_NODES,
  MOCK_PIPELINE_RUNS,
  MOCK_PIPELINE_STATS,
} from '../data/mockData';
import type { PipelineNode, PipelineRun, PipelineStats } from '../types/pipeline';

export async function getPipelineStatus(): Promise<PipelineNode[]> {
  await simulateDelay(null, 400);
  return MOCK_PIPELINE_NODES;
}

export async function getPipelineRuns(): Promise<PipelineRun[]> {
  await simulateDelay(null);
  return MOCK_PIPELINE_RUNS;
}

export async function getPipelineStats(): Promise<PipelineStats> {
  await simulateDelay(null, 200);
  return MOCK_PIPELINE_STATS;
}

