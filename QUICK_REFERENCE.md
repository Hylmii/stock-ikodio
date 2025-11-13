# 🚀 IKODIO - Quick Reference Guide

> Fast reference for common tasks, commands, and troubleshooting

---

## 📦 Installation & Setup

```bash
# Clone repository
git clone https://github.com/Hylmii/stock-ikodio.git
cd stock-ikodio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

---

## 🔧 Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Database (Prisma)
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name description

# Reset database (⚠️ Development only!)
npx prisma migrate reset
```

### Docker
```bash
# Build image
docker build -t ikodio .

# Run container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

---

## 🌐 Environment Variables

### Required
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
DIRECT_URL="postgresql://user:pass@host:5432/dbname"

# Auth
BETTER_AUTH_SECRET="your-64-char-random-string"
BETTER_AUTH_URL="http://localhost:3000" # or production URL

# AI
GEMINI_API_KEY="your-google-gemini-api-key"
```

### Optional
```bash
# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# MongoDB (if using)
MONGODB_URI="mongodb://localhost:27017/ikodio"
```

---

## 📁 Key File Locations

### Configuration
```
├── next.config.ts          # Next.js config
├── middleware.ts           # CORS & routing
├── prisma/schema.prisma    # Database schema
├── tsconfig.json           # TypeScript config
└── tailwind.config.ts      # Tailwind CSS
```

### Authentication
```
lib/better-auth/
├── auth.ts                 # Auth configuration
└── client.ts               # Client auth helpers
```

### API Routes
```
app/api/
├── auth/[...all]/route.ts      # Authentication
├── prediction/route.ts          # Stock predictions
├── multi-modal-prediction/route.ts
├── rti/route.ts                 # Real-time intelligence
└── inngest/route.ts             # Background jobs
```

### Services
```
lib/services/
├── gemini.service.ts           # AI analysis
├── prediction.service.ts       # ML predictions
├── yahoo-finance.service.ts    # Stock data
└── rti-business.service.ts     # Market intelligence
```

### Components
```
components/
├── ui/                    # Base components
├── auth-modal.tsx        # Login/signup
├── TradingViewWidget.tsx # Charts
└── market-overview.tsx   # Market stats
```

---

## 🔐 Authentication Quick Guide

### Sign Up New User
```typescript
// Client-side
import { authClient } from "@/lib/better-auth/client";

await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "User Name"
});
```

### Sign In
```typescript
await authClient.signIn.email({
  email: "user@example.com",
  password: "password"
});
```

### Get Current Session
```typescript
// Server component
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ 
  headers: headers() 
});
```

### Sign Out
```typescript
await authClient.signOut();
```

---

## 🤖 AI Services Usage

### Stock Prediction
```typescript
// API call
const response = await fetch('/api/prediction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symbol: 'BBCA.JK',
    days: 30
  })
});

const data = await response.json();
// Returns: { predictions, metrics, aiAnalysis, recommendation }
```

### Multi-Modal Prediction
```typescript
const response = await fetch('/api/multi-modal-prediction', {
  method: 'POST',
  body: JSON.stringify({
    symbol: 'BBRI.JK',
    timeframe: '1M',
    includeChart: true,
    includeTechnical: true
  })
});
```

---

## 📊 Database Queries

### Create Watchlist Item
```typescript
import prisma from "@/database/prisma";

await prisma.watchlist.create({
  data: {
    userId: session.user.id,
    symbol: "BBCA.JK",
    company: "Bank Central Asia"
  }
});
```

### Get User's Watchlist
```typescript
const watchlist = await prisma.watchlist.findMany({
  where: { userId: session.user.id },
  orderBy: { addedAt: 'desc' }
});
```

### Delete from Watchlist
```typescript
await prisma.watchlist.delete({
  where: {
    userId_symbol: {
      userId: session.user.id,
      symbol: "BBCA.JK"
    }
  }
});
```

---

## 🎨 Styling Quick Reference

### Tailwind CSS Common Classes
```tsx
// Layout
<div className="container mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="flex items-center justify-between">

// Spacing
<div className="p-4 m-2 space-y-4">

// Typography
<h1 className="text-4xl font-bold">
<p className="text-gray-600 dark:text-gray-300">

// Colors
<div className="bg-blue-500 text-white">
<button className="bg-green-600 hover:bg-green-700">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
```

### Dark Mode
```tsx
// Use class-based dark mode
<div className="bg-white dark:bg-gray-900">
<p className="text-gray-900 dark:text-gray-100">
```

---

## 🚨 Common Errors & Solutions

### Error: "Prisma Client not initialized"
```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

### Error: "Better Auth session not found"
```typescript
// Solution: Check if user is authenticated
const session = await auth.api.getSession({ headers: headers() });
if (!session) {
  redirect('/');
}
```

### Error: "CORS policy blocked"
```typescript
// Solution: Ensure CORS is configured in next.config.ts
// and middleware.ts allows your origin
```

### Error: "Gemini API rate limit"
```typescript
// Solution: Implement retry logic with exponential backoff
// or reduce API calls by caching results
```

### Error: "Database connection failed"
```bash
# Solution: Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Test connection: npx prisma db push
```

---

## 📈 Performance Tips

### 1. Image Optimization
```tsx
import Image from "next/image";

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority // for above-fold images
/>
```

### 2. Code Splitting
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <p>Loading...</p> }
);
```

### 3. API Response Caching
```typescript
// In API route
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  // Your API logic
}
```

### 4. Database Query Optimization
```typescript
// Bad: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user.id }
  });
}

// Good: Use include
const users = await prisma.user.findMany({
  include: { watchlists: true }
});
```

---

## 🧪 Testing

### Test API Endpoint
```bash
# Using curl
curl -X POST http://localhost:3000/api/prediction \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BBCA.JK","days":30}'

# Using httpie
http POST localhost:3000/api/prediction \
  symbol=BBCA.JK days:=30
```

### Test Authentication
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

---

## 🔍 Debugging

### Enable Verbose Logging
```typescript
// In API route
console.log('[DEBUG]', { 
  timestamp: new Date().toISOString(),
  data: yourData 
});
```

### Check Database Queries
```bash
# Enable Prisma query logging in schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

### Inspect Build Output
```bash
# Build with verbose output
npm run build -- --debug

# Analyze bundle size
npm run build
# Check .next/analyze/
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` locally
- [ ] Test production build with `npm start`
- [ ] Check all environment variables are set
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Update `BETTER_AUTH_URL` to production domain
- [ ] Set secure cookies: `secure: true` in auth config
- [ ] Remove debug logs and console.logs
- [ ] Test authentication flow
- [ ] Verify API endpoints work

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Post-Deployment
- [ ] Test production URL
- [ ] Verify database connection
- [ ] Check authentication works
- [ ] Test API endpoints
- [ ] Monitor error logs
- [ ] Set up alerts for downtime

---

## 📞 Useful Links

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Better Auth: https://www.better-auth.com
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel: https://vercel.com/docs

### Tools
- Prisma Studio: `npx prisma studio`
- Vercel Dashboard: https://vercel.com/dashboard
- Inngest: https://app.inngest.com

### APIs
- Yahoo Finance: https://finance.yahoo.com
- Gemini AI: https://ai.google.dev
- TradingView: https://www.tradingview.com

---

## 🆘 Getting Help

### Check Logs
```bash
# Vercel logs
vercel logs

# Local logs
npm run dev # Console output

# Docker logs
docker-compose logs -f
```

### Community Support
- GitHub Issues: [Create Issue](https://github.com/Hylmii/stock-ikodio/issues)
- Discord: [Join Server](#)
- Email: support@ikodio.com

---

**Last Updated**: October 30, 2025  
**Version**: 1.0.0
