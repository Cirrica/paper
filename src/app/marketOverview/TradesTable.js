export default function TradesTable() {
  const trades = [
    { date: "07 Jul 25", action: "Buy", ticker: "ETH", qty: 5, price: "$2000", status: "Filled" },
    { date: "07 Jul 25", action: "Buy", ticker: "ETH", qty: 5, price: "$2000", status: "Complete" }
  ];

  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-8 text-[20px]">Recent trades</h4>
     
      <table className="w-full text-center rounded-t-xl text-[14px] overflow-hidden">
        <thead className="bg-dark-gray text-[14px] h-[70px] border-t border-gray-500 ">
          <tr>
            <th className="p-2 rounded-tl-xl rounded-bl-xl border-l border-gray-500 font-normal">Date</th>
            <th className="p-2 font-normal">Action</th>
            <th className="p-2 font-normal">Ticker</th>
            <th className="p-2 font-normal">Qty</th>
            <th className="p-2 font-normal">Price</th>
            <th className="p-2 rounded-br-xl rounded-tr-xl border-r border-gray-500 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((row, i) => (
            <tr key={i} >
              <td className="p-6">{row.date}</td>
              <td className="p-6">{row.action}</td>
              <td className="p-6">{row.ticker}</td>
              <td className="p-6">{row.qty}</td>
              <td className="p-6">{row.price}</td>
              <td className="p-6">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}