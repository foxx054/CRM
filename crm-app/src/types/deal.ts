export type DealStage =
  | "atendimento"
  | "orcamento"
  | "negociacao"
  | "venda_concluida"
  | "pos_venda";

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
  atendimento: "Atendimento",
  orcamento: "Orçamento",
  negociacao: "Negociação",
  venda_concluida: "Venda Concluída",
  pos_venda: "Pós-Venda",
};

export const stageColors: Record<DealStage, string> = {
  atendimento: "#378ADD",
  orcamento: "#EF9F27",
  negociacao: "#D85A30",
  venda_concluida: "#1D9E75",
  pos_venda: "#3C3489",
};
