export default function HoldingsTable() {
  const holdings = [
    {
      ticker: "INFY",
      qty: 20,
      buy: "$1520",
      current: "$160.00",
      pl: "+300",
      gain: "10%",
      plColor: "text-green-500",
    },
    {
      ticker: "INFY",
      qty: 10,
      buy: "$1520",
      current: "$150.00",
      pl: "-200",
      gain: "-2%",
      plColor: "text-red-500",
    },
    {
      ticker: "INFY",
      qty: 20,
      buy: "$1520",
      current: "$360.00",
      pl: "+300",
      gain: "2%",
      plColor: "text-green-500",
    },
  ];

  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">Holdings</h4>
      <table className="w-full text-left border-collapse">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="p-2">Ticker</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Buy Price</th>
            <th className="p-2">Current Price</th>
            <th className="p-2">P&amp;L</th>
            <th className="p-2">% Gain</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((row, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="p-2">{row.ticker}</td>
              <td className="p-2">{row.qty}</td>
              <td className="p-2">{row.buy}</td>
              <td className="p-2">{row.current}</td>
              <td className={`p-2 ${row.plColor}`}>{row.pl}</td>
              <td className="p-2">{row.gain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
