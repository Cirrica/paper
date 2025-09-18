import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardCard from "./DashboardCard";
import HoldingsTable from "./HoldingsTable";
import TradesTable from "./TradesTable";
import StatsCard from "./StatsCard";
import Notifications from "./Notifications";
export default function MarketOverview() {
  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />

        <h3 className="text-xl font-bold mb-4">Portfolio Dashbaord</h3>
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-yellow-600 rounded-md">
            Real Trading
          </button>
          <button className="px-4 py-2 bg-yellow-600 rounded-md">
            Paper Trader
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <DashboardCard label="Total Balance" value="$25,400" />
          <DashboardCard label="Invested Capital" value="$20,000" />
          <DashboardCard
            label="P&L Today"
            value="+300"
            color="text-green-500"
          />
          <DashboardCard
            label="Overall P&L"
            value="+5,400"
            color="text-green-500"
          />
        </div>
        <HoldingsTable />
        <TradesTable />

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatsCard label="Win Rate" value="72%" />
          <StatsCard label="Avg Holding Time" value="5 Days" />
          <StatsCard label="Sharpe Ratio" value="1.24" />
          <StatsCard label="vs SPY" value="+5.3%" color="text-green-500" />
        </div>
        <Notifications />
      </main>
    </div>
  );
}
