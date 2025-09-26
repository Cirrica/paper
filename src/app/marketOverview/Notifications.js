export default function Notifications() {
  const notes = ["TSLA dropped 4% today", "New signal: Buy AAPL"];

  return (
    <div>
      <h4 className="font-semibold mb-2 text-[20px]">Notifications</h4>
      <ul className="list-decimal list-inside text-[17px] space-y-4 py-4">
        {notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
