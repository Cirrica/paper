export default function HoldingsTable() {
  const holdings = [
    {
      ticker: "INFY",
      qty: 20,
      buy: "$1520",
      current: "$160.00",
      pl: "+$300",
      gain: "10%",
      
    },
    {
      ticker: "INFY",
      qty: 10,
      buy: "$1520",
      current: "$150.00",
      pl: "-$200",
      gain: "-2%",
    },
    {
      ticker: "INFY",
      qty: 20,
      buy: "$1520",
      current: "$360.00",
      pl: "+$300",
      gain: "2%",
    },
  ];

  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-8 text-[20px]">Holdings</h4>
     
      <table className="w-full text-center rounded-t-xl text-[14px] overflow-hidden">
        <thead className="bg-dark-gray text-[14px] h-[70px] border-t border-gray-500 ">
          <tr>
            <th className="p-2 rounded-tl-xl rounded-bl-xl border-l border-gray-500 font-normal">Ticker</th>
            <th className="p-2 font-normal">Qty</th>
            <th className="p-2 font-normal">Buy Price</th>
            <th className="p-2 font-normal">Current Price</th>
            <th className="p-2 font-normal">P&amp;L</th>
            <th className="p-2 rounded-br-xl rounded-tr-xl border-r border-gray-500 font-normal">% Gain</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((row, i) => (
            <tr key={i} >
              <td className="p-6">{row.ticker}</td>
              <td className="p-6">{row.qty}</td>
              <td className="p-6">{row.buy}</td>
              <td className="p-6">{row.current}</td>
              <td className="p-6">{row.pl}</td>
              <td className="p-6">{row.gain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}
