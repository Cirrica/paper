export default function TradesTable() {
  const trades = [
    { date: "07 Jul 25", action: "Buy", ticker: "ETH", qty: 5, price: "$2000", status: "Filled" },
    { date: "07 Jul 25", action: "Buy", ticker: "ETH", qty: 5, price: "$2000", status: "Complete" }
  ];

  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">Recent Trades</h4>
      <table className="w-full text-left border-collapse">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
            <th className="p-2">Ticker</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="p-2">{trade.date}</td>
              <td className="p-2">{trade.action}</td>
              <td className="p-2">{trade.ticker}</td>
              <td className="p-2">{trade.qty}</td>
              <td className="p-2">{trade.price}</td>
              <td className="p-2">{trade.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}