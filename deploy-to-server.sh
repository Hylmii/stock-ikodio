#!/bin/bash

# Deploy script for ikodio.com to physical server
# Server: 192.168.0.100:7420
# User: ikodioxlapo

set -e

SERVER_USER="ikodioxlapo"
SERVER_HOST="192.168.0.100"
SERVER_PORT="7420"
REMOTE_DIR="/home/ikodioxlapo/ikodio-app"
LOCAL_DIR="/Users/hylmii/project-ikodiomain"

echo "🚀 Starting deployment to ikodio.com server..."

# 1. Git commit and push first
echo "📝 Committing changes..."
git add .
git commit -m "Fix: CORS configuration for cross-domain authentication (www.ikodio.com ↔ ikodio.com)" || echo "No changes to commit"

echo "📤 Pushing to GitHub..."
git push origin main

# 2. Update SSH config for easier access
echo "🔧 Updating SSH config..."
if ! grep -q "Host ikodio-server" ~/.ssh/config 2>/dev/null; then
    cat >> ~/.ssh/config << EOF

Host ikodio-server
    HostName $SERVER_HOST
    User $SERVER_USER
    Port $SERVER_PORT
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF
    echo "✅ SSH config added"
else
    # Update existing config
    sed -i.bak "s/HostName .*/HostName $SERVER_HOST/" ~/.ssh/config
    sed -i.bak "s/User ikodiomain/User $SERVER_USER/" ~/.ssh/config
    echo "✅ SSH config updated"
fi

# 3. Deploy to server
echo "📦 Syncing files to server..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.env.local' \
    -e "ssh -p $SERVER_PORT" \
    "$LOCAL_DIR/" "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/"

# 4. Build and restart on server
echo "🏗️  Building and restarting application on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
    cd ~/ikodio-app
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🏗️  Building Next.js app..."
    npm run build
    
    echo "🔄 Restarting application..."
    # Check if using PM2, systemd, or docker
    if command -v pm2 &> /dev/null; then
        pm2 restart ikodio || pm2 start npm --name ikodio -- start
        pm2 save
        echo "✅ PM2 restart complete"
    elif systemctl is-active --quiet ikodio; then
        sudo systemctl restart ikodio
        echo "✅ Systemd restart complete"
    elif docker ps | grep -q ikodio; then
        docker-compose down && docker-compose up -d --build
        echo "✅ Docker restart complete"
    else
        echo "⚠️  Please restart the application manually"
        echo "   Run: npm start"
    fi
    
    echo "✅ Deployment complete!"
ENDSSH

echo ""
echo "✅ Deployment successful!"
echo "🌐 Application should be live at:"
echo "   - https://ikodio.com"
echo "   - https://www.ikodio.com"
echo ""
echo "📋 Next steps:"
echo "   1. Test authentication: Sign up / Login from www.ikodio.com"
echo "   2. Check CORS headers: curl -I https://ikodio.com/api/auth/sign-up/email"
echo "   3. Monitor logs: ssh ikodio-server 'pm2 logs ikodio'"
