import { simulateDelay } from './client';
import { MOCK_PIPELINE_NODES, MOCK_PIPELINE_RUNS, MOCK_PIPELINE_STATS, } from '../data/mockData';
export async function getPipelineStatus() {
    await simulateDelay(null, 400);
    return MOCK_PIPELINE_NODES;
}
export async function getPipelineRuns() {
    await simulateDelay(null);
    return MOCK_PIPELINE_RUNS;
}
export async function getPipelineStats() {
    await simulateDelay(null, 200);
    return MOCK_PIPELINE_STATS;
}
