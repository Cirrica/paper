export default function DashboardCard({ label, value, color }) {
  return (
    <div className="p-4 rounded-xl">
      <p className="text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
