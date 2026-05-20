import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import "./Tarefas.css";

export default function Tarefas() {
  const { tasks, addTask, toggleTask, deleteTask } = useData();
  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim());
    setNewTitle("");
  }

  const activeTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  return (
    <div className="tarefas-page">
      <h1>Tarefas</h1>
      <p className="subtitle">{activeTasks.length} pendente{activeTasks.length !== 1 ? "s" : ""}</p>

      <form className="task-form" onSubmit={handleAdd}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nova tarefa..."
        />
        <button type="submit" className="btn btn-primary">
          <IconPlus size={16} />
          Adicionar
        </button>
      </form>

      {activeTasks.length > 0 && (
        <div className="task-section">
          <h3>Pendentes</h3>
          {activeTasks.map((t) => (
            <div key={t.id} className="task-row">
              <label className="task-check">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span className="task-title">{t.title}</span>
              </label>
              {t.relatedTo && <span className="task-related">{t.relatedTo}</span>}
              <button className="btn-icon task-del" onClick={() => deleteTask(t.id)} title="Excluir">
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {doneTasks.length > 0 && (
        <div className="task-section">
          <h3>Concluídas ({doneTasks.length})</h3>
          {doneTasks.map((t) => (
            <div key={t.id} className="task-row done">
              <label className="task-check">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span className="task-title">{t.title}</span>
              </label>
              {t.relatedTo && <span className="task-related">{t.relatedTo}</span>}
              <button className="btn-icon task-del" onClick={() => deleteTask(t.id)} title="Excluir">
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
