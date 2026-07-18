# Screener Analyst - FREE Deployment Guide 🚀

Ye standalone HTML file hai jo **bilkul free** deploy ho sakta hai **kisi bhi hosting** par!

## Option 1: Vercel (Free) - 1 minute

```bash
# 1. Apne computer mein terminal kholo
cd /vercel/share/v0-project

# 2. GitHub par code push karo
git init
git add .
git commit -m "Screener Analyst"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/screener-analyst.git
git push -u origin main

# 3. Vercel par jaao
# https://vercel.com
# New Project > Select GitHub repo > Deploy
```

**URL:** `https://screener-analyst.vercel.app/screener.html`

---

## Option 2: GitHub Pages (Bilkul Free) - 2 minutes

```bash
# 1. GitHub par repo banao (free)
# https://github.com/new

# 2. Push this code
git push -u origin main

# 3. GitHub Settings > Pages > Source = main branch

# 4. Done!
```

**URL:** `https://YOUR_USERNAME.github.io/screener-analyst/public/screener.html`

---

## Option 3: Netlify (Free) - 1 minute

1. https://netlify.com par jaao
2. GitHub se connect karo
3. Deploy button click karo
4. Done!

---

## ⚠️ IMPORTANT - Anthropic API Key Setup

Ye website **Anthropic API** use karta hai (Claude direct). 

### How it works:
- User apna **Anthropic API Key** enter karte hain
- Screenshot upload hota hai
- Claude analysis hota hai
- **Koi server nahi, koi credit card nahi**

### Users ke liye setup:
1. https://console.anthropic.com par jaao
2. API Key generate karo (free trial = 5$ credit)
3. Website mein paste karo
4. Use karo!

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel/GitHub/Netlify Hosting | **FREE** |
| Claude API (Anthropic) | ~$0.003 per analysis* |
| Domain (optional) | $10-15/year |

*User pays for their own API key - you don't need to pay anything!

---

## How Users Use It

1. Open `screener.html`
2. Upload Chartink screenshot
3. Paste their Anthropic API key (one-time)
4. Get instant analysis
5. Done!

---

## Deploy Now!

```bash
# Quick deploy to Vercel:
npx vercel --prod
```

**Link share karo:** `https://YOUR_DOMAIN/screener.html`

All users can access and use it with their own API key!
