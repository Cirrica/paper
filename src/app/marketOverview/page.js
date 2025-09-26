"use client";

import DashboardCard from "./DashboardCard";
import HoldingsTable from "./HoldingsTable";
import TradesTable from "./TradesTable";
import Notifications from "./Notifications";
import Sidebar from "../components/sidebar";
import ProfileHeader from "../components/profileHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarketOverview() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  //Authentication

  useEffect(() => {
    const storedToken = localStorage.getItem("cirricaToken");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("cirricaToken");
    setToken(null);
    setIsAuthenticated(false);
    router.push("/");
  };
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {" "}
        <div className="text-center">
          {" "}
          <p>Checking authentication...</p>{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar + Profile Header */}

      <Sidebar />
      <main className="flex-1 px-8 py-4">
        <ProfileHeader
          user={{
            name: "James Raymond",
            accountNumber: "4453728992",
            profilePicture: "/IconProfilePicture.svg",
          }}
          balances={{
            portfolio: 623098.17,
            available: 122912.5,
          }}
        />

        {/* Portfolio Dashboard */}

        <h3 className="text-[20px] font-bold pt-4">Portfolio Dashbaord</h3>
        <div className="flex gap-6 my-8">
          <button className="px-4 py-2 bg-gold rounded-xl border-t border-l border-r border-gray-500 w-[247px] h-[70px] text-[17px]">
            Real Trading
          </button>
          <button className="px-4 py-2 bg-dark-gray rounded-xl border-t border-l border-r border-gray-500 w-[247px] h-[70px] text-[17px]">
            Paper Trader
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 pt-2 pb-8">
          <DashboardCard label="Total Balance" value="$25,400" />
          <DashboardCard label="Invested Capital" value="$20,000" />
          <DashboardCard label="P&L Today" value="+300" color="text-positive" />
          <DashboardCard
            label="Overall P&L"
            value="+5,400"
            color="text-positive"
          />
        </div>

        {/* Tables */}
        <HoldingsTable />
        <TradesTable />

        <div className="grid grid-cols-4 gap-4 mb-8 pb-8">
          <DashboardCard label="Win rate" value="72%" />
          <DashboardCard label="Avg Holding Time" value="5 Days" />
          <DashboardCard label="Sharpe Ratio" value="1.24" />
          <DashboardCard label="vs SPY" value="+5.3%" color="text-positive" />
        </div>

        <Notifications />
      </main>
    </div>
  );
}
