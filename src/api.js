
const API_KEY =
  "44d472c47aac0c16028c3e0279aaa42579e489e193a7c8cfc38840d3a0ccbe10v ";

export const loadTicker = (tickers) => {
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  ).then((res) => res.json());
};
