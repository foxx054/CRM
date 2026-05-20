export type DealStage = "prospecting" | "qualification" | "proposal" | "closed";

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  contactName: string;
  createdAt: string;
}

export const stageLabels: Record<DealStage, string> = {
  prospecting: "Prospecção",
  qualification: "Qualificação",
  proposal: "Proposta",
  closed: "Fechado",
};

export const stageColors: Record<DealStage, string> = {
  prospecting: "var(--accent)",
  qualification: "var(--warning)",
  proposal: "var(--danger)",
  closed: "var(--success)",
};
