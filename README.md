# Traders Hub — One API. Every Market.

A Zuplo-powered, monetizable signals API delivering **BUY / SELL / HOLD** calls across **10,000+ instruments** spanning **7 markets**: US Stocks (NYSE/NASDAQ), Crypto, Forex, JSE (Johannesburg Stock Exchange), LSE (London Stock Exchange), Indices, and Commodities. Signals are powered by a multi-indicator engine (RSI, MA crossover, multi-timeframe trend alignment, and news sentiment).

**Coverage at a glance**

| Market | Instruments |
| ------ | ----------- |
| US Stocks | 6,000+ tickers (NYSE, NASDAQ) |
| Crypto | 500+ coins (BTC, ETH, SOL, …) |
| Forex | 180 pairs (majors, minors, EM) |
| JSE | 350 stocks |
| LSE | 2,000 stocks |
| Indices | 50 globals (S&P 500, Dow, Nasdaq, FTSE, DAX, …) |
| Commodities | 30 futures (Gold, Oil, Silver, Copper, Natgas, …) |

```
Customer  →  Zuplo Gateway (this repo)  →  Python signal backend
              [API keys + rate limit]      [traders-hub-signals.pplx.app]
```

---

## Endpoints

| Method | Path             | Auth    | Description                                            |
| ------ | ---------------- | ------- | ------------------------------------------------------ |
| GET    | `/v1/signal`     | API key | BUY/SELL/HOLD signal with confidence score             |
| GET    | `/v1/sentiment`  | API key | News sentiment score from recent headlines             |
| GET    | `/v1/multiframe` | API key | Trend alignment across daily / weekly / monthly        |
| GET    | `/v1/health`     | none    | Health check                                           |

## Live demo

A public demo dashboard that calls all three endpoints is available — see the GitHub PR description for the URL.

### Example

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR-ZUPLO-DOMAIN/v1/signal?ticker=AAPL"
```

```json
{
  "ticker": "AAPL",
  "signal": "BUY",
  "confidence": 70,
  "last_price": 271.35,
  "indicators": { "rsi": 61.64, "rsi_status": "neutral", "trend": "uptrend" },
  "as_of": "2026-04-30T20:22:34Z",
  "disclaimer": "For informational purposes only. Not financial advice."
}
```

---

## Pricing tiers (already wired in policies.json)

| Tier | Daily limit  | Suggested price | How to assign                              |
| ---- | ------------ | --------------- | ------------------------------------------ |
| Free | 100 calls    | $0              | Default for all keys                       |
| Pro  | 10,000 calls | $9.99 / month   | Set consumer metadata `tier=pro` in Zuplo  |

The `tier-rate-limit` policy in `config/policies.json` uses Zuplo's **complex-rate-limit-inbound** policy: keys with metadata `tier=pro` get 10k/day, everyone else gets 100/day automatically. To upgrade a customer to Pro:

1. Open the Zuplo dashboard → API Key Service → find the consumer
2. Add metadata: `{ "tier": "pro" }`
3. The next request from that key uses the higher limit

---

## Backend

The signal logic lives in a Python FastAPI service hosted at:

**https://traders-hub-signals.pplx.app**

Source: [`/home/user/workspace/trading-signal-api/main.py`] (deployed via Perplexity Computer)

The Zuplo gateway forwards `/v1/signal` → `https://traders-hub-signals.pplx.app/port/5000/signal` using a `urlForwardHandler`.

---

## Local development

```bash
npm install
npm run dev
```

Visit [http://localhost:9000](http://localhost:9000).

---

## Going live

1. Push to `main` — Zuplo auto-deploys.
2. In the Zuplo dashboard:
   - Open the **API Keys** service and create your first consumer key.
   - Set up a Stripe-backed plan if you want to charge customers (see the `money-api` reference repo for a full example).
3. List the API on RapidAPI pointing customers to your Zuplo URL.

## Disclaimer

For informational and educational purposes only. Not financial advice. Past performance does not guarantee future results.

---

## Pine Pro (Ultra tier)

Ultra subscribers get bundled access to the **Pine Pro** TradingView indicator library — the same engine that powers `/v1/signal` exposed as native TradingView scripts across stocks, crypto, forex, JSE, and gold.

See the full guide: [/pine-pro](https://docs.tradershub.dev/pine-pro)

Entitlement check:

```bash
curl -H "Authorization: Bearer YOUR_ULTRA_KEY" \
  https://api.tradershub.dev/v1/account/entitlements
```

A response containing `"pine_pro_access": true` confirms the entitlement.
