export default function DashboardCard({ label, value, color }) {
  return (
    <div className="p-4 rounded-xl border-t border-l border-r border-gray-500 text-center">
      <p className="text-[14px] font-bold">{label}</p>
      <p className={`text-[21px] font-bold ${color}`}>{value}</p>
    </div>
  );
}
