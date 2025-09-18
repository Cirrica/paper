export default function Notifications() {
  const notes = ["TSLA dropped 4% today", "New signal: Buy AAPL"];

  return (
    <div>
      <h4 className="font-semibold mb-2">Notifications</h4>
      <ul className="list-disc list-inside text-gray-300">
        {notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
