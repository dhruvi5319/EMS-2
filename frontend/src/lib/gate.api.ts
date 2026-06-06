import { api } from './api';

export interface GateDecisionResult {
  id: string;
  gate_name: string;
  decision: string;
  rationale: string | null;
  decided_by: string | null;
  decided_at: string;
}

export interface P2DecisionResponse {
  gate_decision: GateDecisionResult;
  planning_record: { id: string; status: string; engagement_id: string };
}

export async function recordP2Decision(
  engagementId: string,
  data: { decision: 'approved' | 'returned'; comment: string }
): Promise<P2DecisionResponse> {
  // calls POST /api/engagements/:id/gate/p2
  const res = await api.post<P2DecisionResponse>(
    `/api/engagements/${engagementId}/gate/p2`,
    data
  );
  if (!res.ok) throw new Error(res.error);
  return res.data;
}
