import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Deal, DealStage } from "../types/deal";
import { stageLabels, stageColors } from "../types/deal";
import { useData } from "../contexts/DataContext";
import DealFormModal from "../components/DealFormModal";
import "../components/ClientFormModal.css";
import "./Deals.css";

const stages: DealStage[] = ["atendimento", "orcamento", "negociacao", "venda_concluida", "pos_venda"];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SortableCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card">
      <span className="card-title">{deal.title}</span>
      <span className="card-company">{deal.company}</span>
      <span className="card-contact">{deal.contactName}</span>
      <span className="card-value">{deal.stage === "atendimento" ? "---" : formatCurrency(deal.value)}</span>
    </div>
  );
}

function Column({ stage, deals }: { stage: DealStage; deals: Deal[] }) {
  return (
    <div className="kanban-column">
      <div className="column-header" style={{ borderTopColor: stageColors[stage] }}>
        <span className="column-title">{stageLabels[stage]}</span>
        <span className="column-count">{deals.length}</span>
      </div>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="column-cards">
          {deals.map((deal) => <SortableCard key={deal.id} deal={deal} />)}
          {deals.length === 0 && <span className="column-empty">Nenhum negócio</span>}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Deals() {
  const location = useLocation();
  const { deals, setDeals } = useData();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    if ((location.state as { novoNegocio?: boolean })?.novoNegocio) {
      setModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleSave(data: Omit<Deal, "id" | "createdAt">) {
    const newDeal: Deal = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDeals((prev) => [newDeal, ...prev]);
  }

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find((d) => d.id === event.active.id);
    if (deal) setActiveDeal(deal);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeDeal = deals.find((d) => d.id === activeId);
    const overDeal = deals.find((d) => d.id === overId);
    if (!activeDeal) return;

    const overStage = overDeal?.stage ?? (overId as DealStage);

    if (activeDeal.stage === overStage) {
      const columnDeals = deals.filter((d) => d.stage === overStage);
      const oldIndex = columnDeals.findIndex((d) => d.id === activeId);
      const newIndex = columnDeals.findIndex((d) => d.id === overId);
      if (oldIndex === newIndex || newIndex === -1) return;
      const reordered = [...columnDeals];
      reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, activeDeal);
      setDeals((prev) => [...prev.filter((d) => d.stage !== overStage), ...reordered]);
      return;
    }

    setDeals((prev) => prev.map((d) => (d.id === activeId ? { ...d, stage: overStage } : d)));
  }

  const columns = stages.map((stage) => ({ stage, deals: deals.filter((d) => d.stage === stage) }));

  return (
    <div className="deals-page">
      <div className="deals-header">
        <div>
          <h1>Negócios</h1>
          <p className="subtitle">{deals.length} negócios no pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Novo Negócio</button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map((col) => <Column key={col.stage} stage={col.stage} deals={col.deals} />)}
        </div>
        <DragOverlay>
          {activeDeal ? (
            <div className="kanban-card drag-overlay">
              <span className="card-title">{activeDeal.title}</span>
              <span className="card-company">{activeDeal.company}</span>
              <span className="card-contact">{activeDeal.contactName}</span>
              <span className="card-value">{activeDeal.stage === "atendimento" ? "---" : formatCurrency(activeDeal.value)}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealFormModal
        open={modalOpen}
        deal={editingDeal}
        onClose={() => { setModalOpen(false); setEditingDeal(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
