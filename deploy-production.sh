#!/bin/bash

# IKODIO - Production Deployment Script
# Deploys with CORS fixes to production server

set -e  # Exit on error

echo "=========================================="
echo "🚀 IKODIO Production Deployment"
echo "=========================================="
echo ""

# Configuration
SSH_USER="ikodioxlapo"
SSH_HOST="192.168.1.11"
SSH_PORT="7420"
REMOTE_DIR="/home/ikodioxlapo/project-ikodiomain"
PROJECT_DIR="/Users/hylmii/project-ikodiomain"

echo "📋 Deployment Configuration:"
echo "   Local:  ${PROJECT_DIR}"
echo "   Remote: ${SSH_USER}@${SSH_HOST}:${SSH_PORT}"
echo "   Path:   ${REMOTE_DIR}"
echo ""

# Step 1: Build locally
echo "🔨 Step 1/5: Building production locally..."
cd "${PROJECT_DIR}"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Create deployment package
echo "📦 Step 2/5: Creating deployment package..."
echo "   Excluding: node_modules, .git, .next/cache"

# Create tarball with essential files only
tar -czf /tmp/ikodio-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    .next \
    app \
    components \
    database \
    hooks \
    lib \
    prisma \
    public \
    store \
    types \
    middleware.ts \
    next.config.ts \
    package.json \
    package-lock.json \
    tsconfig.json \
    .env.local 2>/dev/null || tar -czf /tmp/ikodio-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    .next \
    app \
    components \
    database \
    hooks \
    lib \
    prisma \
    public \
    store \
    types \
    middleware.ts \
    next.config.ts \
    package.json \
    package-lock.json \
    tsconfig.json

echo "✅ Package created: /tmp/ikodio-deploy.tar.gz"
ls -lh /tmp/ikodio-deploy.tar.gz
echo ""

# Step 3: Transfer to server
echo "📤 Step 3/5: Uploading to server..."
scp -P ${SSH_PORT} /tmp/ikodio-deploy.tar.gz ${SSH_USER}@${SSH_HOST}:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed! Check SSH connection."
    exit 1
fi

echo "✅ Upload complete!"
echo ""

# Step 4: Deploy on server
echo "🔄 Step 4/5: Deploying on server..."
ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
    set -e
    
    echo "   📂 Backing up current deployment..."
    cd /home/ikodioxlapo
    if [ -d "project-ikodiomain" ]; then
        cp -r project-ikodiomain project-ikodiomain.backup.$(date +%Y%m%d_%H%M%S)
        echo "   ✅ Backup created"
    fi
    
    echo "   📦 Extracting new version..."
    cd /home/ikodioxlapo/project-ikodiomain
    tar -xzf /tmp/ikodio-deploy.tar.gz
    
    echo "   📚 Installing dependencies..."
    npm ci --production
    
    echo "   🗄️  Running Prisma migrations..."
    npx prisma migrate deploy
    npx prisma generate
    
    echo "   ✅ Deployment extracted and configured"
ENDSSH

echo "✅ Server deployment complete!"
echo ""

# Step 5: Restart application
echo "🔄 Step 5/5: Restarting application..."
ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
    # Check if PM2 is managing the app
    if pm2 list | grep -q ikodio; then
        echo "   🔄 Restarting with PM2..."
        pm2 restart ikodio
        pm2 save
        
        echo ""
        echo "   📊 PM2 Status:"
        pm2 list
        
        echo ""
        echo "   📋 Recent logs:"
        pm2 logs ikodio --lines 10 --nostream
    else
        echo "   ⚠️  PM2 process 'ikodio' not found!"
        echo "   Starting new PM2 process..."
        cd /home/ikodioxlapo/project-ikodiomain
        pm2 start npm --name ikodio -- start
        pm2 save
        
        echo ""
        echo "   📊 PM2 Status:"
        pm2 list
    fi
ENDSSH

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "🌐 Your application is now running at:"
echo "   • https://ikodio.com"
echo "   • https://www.ikodio.com"
echo ""
echo "🔍 Next Steps:"
echo "   1. Test authentication: Sign up and login"
echo "   2. Check CORS headers:"
echo "      curl -I https://ikodio.com/api/auth/sign-up/email"
echo "   3. Monitor logs:"
echo "      ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} 'pm2 logs ikodio'"
echo ""
echo "🎯 What was fixed in this deployment:"
echo "   ✅ CORS headers for cross-domain auth (www ↔ non-www)"
echo "   ✅ Cookie domain set to .ikodio.com (includes subdomains)"
echo "   ✅ Better Auth CORS configuration enabled"
echo "   ✅ Credentials support for cookie-based auth"
echo ""
echo "📝 Test checklist:"
echo "   □ Open https://www.ikodio.com in browser"
echo "   □ Click 'Sign Up' button"
echo "   □ Enter email and password"
echo "   □ Check Network tab - should see successful API calls"
echo "   □ Verify cookies have domain=.ikodio.com"
echo ""
echo "🛠️  Useful commands:"
echo "   pm2 list              - Check app status"
echo "   pm2 logs ikodio       - View real-time logs"
echo "   pm2 restart ikodio    - Restart application"
echo "   pm2 monit             - Monitor resources"
echo ""

# Cleanup
rm -f /tmp/ikodio-deploy.tar.gz

echo "🎉 Happy deploying!"
echo ""
