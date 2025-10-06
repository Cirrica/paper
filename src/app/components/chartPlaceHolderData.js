const TIMEFRAME_OPTIONS = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'All', '2m ▼'];

function createDeterministicRng(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

function calculateRsi(candles, period = 14) {
  if (candles.length === 0) {
    return [];
  }

  const rsi = [];
  let gainSum = 0;
  let lossSum = 0;

  for (let index = 1; index <= period && index < candles.length; index += 1) {
    const change = candles[index].close - candles[index - 1].close;
    gainSum += change > 0 ? change : 0;
    lossSum += change < 0 ? -change : 0;
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  for (let index = period; index < candles.length; index += 1) {
    if (index > period) {
      const change = candles[index].close - candles[index - 1].close;
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;
      avgGain = ((avgGain * (period - 1)) + gain) / period;
      avgLoss = ((avgLoss * (period - 1)) + loss) / period;
    }

    const relativeStrength = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const value = 100 - 100 / (1 + relativeStrength);
    rsi.push({ time: candles[index].time, value: roundToTwo(Math.max(20, Math.min(80, value))) });
  }

  return rsi;
}

function generateMockStockData() {
  const rng = createDeterministicRng(20241005);
  const candles = [];
  const ma50 = [];
  const ma200 = [];
  const startTimestamp = Math.floor(new Date('2023-11-01T00:00:00Z').getTime() / 1000);
  const totalPoints = 240;
  const secondsInDay = 24 * 60 * 60;
  let ma50Sum = 0;
  let ma200Sum = 0;
  let previousClose = 360;

  for (let index = 0; index < totalPoints; index += 1) {
    const time = startTimestamp + index * secondsInDay;
    const directionalDrift = 0.42 + (index / totalPoints) * 0.2;
    const cyclical = Math.sin(index * 0.18) * 6.5 + Math.cos(index * 0.045) * 4.2;
    const shock = (rng() - 0.5) * 4.4;
    const closeRaw = previousClose + directionalDrift + cyclical * 0.18 + shock;
    const close = roundToTwo(closeRaw);
    const openBias = (rng() - 0.5) * 6.2;
    const open = roundToTwo(previousClose + openBias);
    const high = roundToTwo(Math.max(open, close) + Math.abs((rng() + 0.25) * 3.6) + 1.4);
    const low = roundToTwo(Math.min(open, close) - Math.abs((rng() + 0.15) * 3.3) - 1.4);
    const volumeBase = 1700000 + index * 900;
    const volumeSwing = Math.abs(Math.sin(index * 0.33)) * 820000 + rng() * 280000;
    const volume = Math.round(volumeBase + volumeSwing);

    const candle = {
      time,
      open,
      high,
      low,
      close,
      volume,
    };

    candles.push(candle);
    previousClose = close;

    ma50Sum += close;
    ma200Sum += close;

    if (index >= 49) {
      if (index >= 50) {
        ma50Sum -= candles[index - 50].close;
      }
      ma50.push({ time, value: roundToTwo(ma50Sum / 50) });
    }

    if (index >= 199) {
      if (index >= 200) {
        ma200Sum -= candles[index - 200].close;
      }
      ma200.push({ time, value: roundToTwo(ma200Sum / 200) });
    }
  }

  const rsiPoints = calculateRsi(candles, 14);
  const rsiByTime = new Map(rsiPoints.map((point) => [point.time, point.value]));
  let lastRsi = rsiPoints[0]?.value ?? 50;
  const indicator = candles.map((candle) => {
    const value = rsiByTime.get(candle.time);
    if (value !== undefined) {
      lastRsi = value;
    }
    return { time: candle.time, value: roundToTwo(lastRsi) };
  });

  return {
    candles,
    overlays: [
      { label: 'MA50', color: '#4E7DFF', colorClass: 'bg-[#4E7DFF]', lineWidth: 2, data: ma50 },
      { label: 'MA200', color: '#1EC8FF', colorClass: 'bg-[#1EC8FF]', lineWidth: 2, data: ma200 },
    ],
    indicator,
  };
}

export { generateMockStockData, TIMEFRAME_OPTIONS };
