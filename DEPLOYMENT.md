# Screener Analyst - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial Screener Analyst app"
git branch -M main

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/screener-analyst.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Click "Deploy"
5. Done! Your app is live 🎉

### Step 3: Setup Billing (IMPORTANT)
1. Go to https://vercel.com/account/billing
2. Add a valid credit card
3. Enable "AI Gateway" billing
4. Your app is now ready for AI analysis

## Environment Variables Needed
Your `.env.development.local` is already configured with:
- `AI_GATEWAY_API_KEY` - For Claude model access

## Features Available After Deployment
- Upload Chartink screener screenshots
- Get AI-powered trading analysis
- View top 3 picks with trading thesis
- See avoid warnings
- Get watchlist recommendations

## Support
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
