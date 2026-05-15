# Foodies

**Good food shouldn't go to waste. It should go to someone's plate.**

Foodies is a food rescue marketplace built around a simple idea: if you've cooked more than you can eat, sell it to someone nearby instead of throwing it away. And if you're a restaurant with food that didn't sell today, offer it at a good price before it goes to waste.

---

## The Mission

Every day, tonnes of perfectly good food gets thrown away — home-cooked meals that were too much for one family, restaurant dishes that didn't sell before closing time. Foodies exists to stop that.

We give home cooks a way to turn their surplus into income, and we give restaurants a last-chance channel to sell unsold food at a discount rather than bin it. Buyers get access to fresh, real food at honest prices. Everyone wins — and less food ends up in the bin.

---

## Who It's For

### Home Cooks
You made a big pot of biryani, a tray of lasagne, or a batch of sweets. You can't finish it all. Instead of letting it go to waste, list it on Foodies and sell it to someone nearby who'd love a home-cooked meal.

### Restaurants
It's 8pm and you have dishes that didn't sell at full price. Rather than throwing them out at closing, list them on Foodies with a good offer. Someone gets a great deal, you recover some cost, and nothing goes in the bin.

### Buyers
You get access to fresh, authentic food — home-cooked meals and restaurant dishes — often at prices that reflect the reality that the seller just wants it to find a good home rather than a bin.

---

## How It Works

### For Home Cooks & Restaurants (Sellers)
1. Sign up and register as a seller — choose **Homemade** or **Restaurant**
2. List a dish with its name, quantity, serving size, and what makes it special
3. Set how long the listing stays live (default: 6 hours) — after that it expires automatically
4. Buyers in the feed can see your dish and reach out to get it
5. Unsold dishes expire cleanly — no stale listings cluttering the feed

### For Buyers
1. Sign up with email or phone
2. Browse the live feed — only fresh, in-window dishes from sellers near you
3. See exactly what's on offer: what it is, how much, and what makes it worth having
4. Expired or sold-out listings never appear — the feed is always current

---

## Core Features

- **Sell surplus food, not waste it** — the primary motivation for every listing
- **Restaurant rescue offers** — restaurants can list end-of-day food at reduced prices
- **Auto-expiry** — every dish has a configurable availability window (default 6 hours); expired dishes vanish from the feed automatically
- **Homemade vs Restaurant** — sellers declare their type so buyers know what they're getting
- **Live feed** — buyers only see dishes that are currently available and not their own
- **Role-based access** — `user`, `seller`, `admin`
- **Secure auth** — login with email or phone number; JWT sessions with graceful expiry
- **Full audit trail** — every record tracks creation, updates, and soft deletes; nothing is permanently lost

---

## Business Model Opportunities

- **Small commission per sale** — take a modest cut only when food actually sells
- **Restaurant partnerships** — subscription or featured placement for restaurants that regularly list end-of-day offers
- **Zero-waste impact reporting** — show sellers and the platform how much food was saved from waste (a strong marketing and social impact story)
- **Hyperlocal expansion** — launch neighbourhood by neighbourhood, where the home cooking culture and food waste problem are both most visible

---

## Technical Setup

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for setup, deployment, and migration instructions.
