# ============================================

# SETUP VERCEL POSTGRES - Step by Step

# ============================================

## Step 1: Login ke Vercel

1. Buka: https://vercel.com/dashboard
2. Login dengan GitHub account Anda

## Step 2: Create Postgres Database

1. Klik project: "stock-ikodio"
2. Klik tab: "Storage"
3. Klik: "Create Database"
4. Pilih: "Postgres"
5. Database Name: ikodio-db
6. Region: Pilih "Singapore (sin1)" - terdekat
7. Klik: "Create"

## Step 3: Connect to Project

1. Setelah database dibuat, klik "Connect Project"
2. Pilih project: "stock-ikodio"
3. Environment: Pilih semua (Production, Preview, Development)
4. Klik: "Connect"

## Step 4: Copy Connection String

Vercel akan auto-add environment variables:

- POSTGRES_URL
- POSTGRES_PRISMA_URL ← COPY YANG INI!
- POSTGRES_URL_NON_POOLING

Copy value dari POSTGRES_PRISMA_URL

## Step 5: Update Local .env

Buka terminal di project dan run:

```bash
# Download environment variables dari Vercel
vercel env pull .env.local
```

Atau manual update .env.local:

```bash
DATABASE_URL="[paste POSTGRES_PRISMA_URL here]"
```

## Step 6: Push Schema ke Database

```bash
npx prisma db push
```

## Step 7: Test

```bash
npm run dev
# Visit: http://localhost:3000
# Try sign up/sign in
```

## Done! ✅

Database sudah ready untuk development dan production!
