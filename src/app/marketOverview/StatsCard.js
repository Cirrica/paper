export default function StatsCard({ label, value, color }) {
  return (
    <div className="p-4 rounded-xl text-center">
      <p className="text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
