#!/bin/bash

echo " Setting up Stock Trading Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "  Python 3 is not installed. ML service will not be available."
    SKIP_ML=true
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "  PostgreSQL is not installed. Database features will not be available."
    SKIP_DB=true
fi

echo " Installing Node.js dependencies..."
npm install

echo ""
echo " Building packages..."
npm run build

echo ""
if [ "$SKIP_DB" != true ]; then
    echo "  Setting up database..."
    cd packages/database
    cp .env.example .env
    echo "Please configure DATABASE_URL in packages/database/.env"
    echo "Then run: npm run db:migrate"
    cd ../..
else
    echo "⏭  Skipping database setup (PostgreSQL not installed)"
fi

echo ""
if [ "$SKIP_ML" != true ]; then
    echo " Setting up ML service..."
    cd apps/ml-service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env
    cd ../..
    echo " ML service configured"
else
    echo "⏭  Skipping ML service setup (Python not installed)"
fi

echo ""
echo " Setting up API server..."
cd apps/api
cp .env.example .env
echo "Please configure environment variables in apps/api/.env"
cd ../..

echo ""
echo " Setting up web app..."
cd apps/web
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:8000" >> .env.local
cd ../..

echo ""
echo " Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure DATABASE_URL in packages/database/.env"
echo "2. Run database migrations: cd packages/database && npm run db:migrate"
echo "3. Seed the database: npm run db:seed"
echo "4. Configure API keys in apps/api/.env"
echo "5. Start the development servers:"
echo "   - API: cd apps/api && npm run dev"
echo "   - ML Service: cd apps/ml-service && source venv/bin/activate && python main.py"
echo "   - Web: cd apps/web && npm run dev"
echo ""
echo " Documentation: README.md"