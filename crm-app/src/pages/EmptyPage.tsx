interface Props {
  title: string;
}

export default function EmptyPage({ title }: Props) {
  return (
    <div style={{ paddingTop: 40, textAlign: "center", color: "var(--text-muted)" }}>
      <h1>{title}</h1>
      <p style={{ marginTop: 8, fontSize: "0.9rem" }}>Em desenvolvimento</p>
    </div>
  );
}
