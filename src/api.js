const API_KEY =
  "6bae7a466f19eb8e116d33c9c103ca82ce3f2095fe3352feb094a52e95ec8078 ";
const AGGREGATE_INDEX = "5";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
socket.addEventListener("message", (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
    e.data
  );
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});
function sendToWebSocket(message) {
  const stringifeiedMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifeiedMessage);
    return;
  }
  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifeiedMessage);
    },
    { once: true }
  );
}
function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}
function unSubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subcribeToTicker = (ticker, cb) => {
  const subsribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subsribers, cb]);
  subscribeToTickerOnWs(ticker);
};
export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unSubscribeFromTickerOnWs(ticker);
};
window.tickers = tickersHandlers;
