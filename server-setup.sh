#!/bin/bash
# IKODIO - Server Setup Script
# Run this directly on the server (SSH first)

echo "=========================================="
echo "IKODIO - Server Configuration"
echo "=========================================="
echo "Server: $(hostname)"
echo ""
echo "📋 Choose setup option:"
echo "1. Open Port 3000 (Quick - Access via http://180.252.81.33:3000)"
echo "2. Setup Nginx on Port 80 (Recommended - Access via http://180.252.81.33)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔓 Opening port 3000 in firewall..."
        sudo ufw allow 3000/tcp
        sudo ufw status
        echo ""
        echo "✅ DONE! Access your app at:"
        echo "   http://180.252.81.33:3000"
        echo "   or"
        echo "   http://192.168.0.100:3000 (local network only)"
        ;;
    2)
        echo ""
        echo "🌐 Setting up Nginx reverse proxy..."
        
        # Copy nginx config
        sudo cp /tmp/ikodio-nginx.conf /etc/nginx/sites-available/ikodio
        
        # Create symlink
        sudo ln -sf /etc/nginx/sites-available/ikodio /etc/nginx/sites-enabled/ikodio
        
        # Remove default if exists
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Test nginx config
        echo ""
        echo "Testing Nginx configuration..."
        sudo nginx -t
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "Restarting Nginx..."
            sudo systemctl restart nginx
            sudo systemctl status nginx --no-pager
            
            echo ""
            echo "Opening port 80 in firewall..."
            sudo ufw allow 80/tcp
            sudo ufw status
            
            echo ""
            echo "✅ DONE! Access your app at:"
            echo "   http://180.252.81.33"
            echo "   or"
            echo "   http://192.168.0.100 (local network only)"
        else
            echo ""
            echo "❌ Nginx config test failed. Please check the error above."
        fi
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "📊 Check PM2 status: pm2 list"
echo "📋 View PM2 logs: pm2 logs ikodio"
echo "🔄 Restart app: pm2 restart ikodio"
echo "🛑 Stop app: pm2 stop ikodio"
echo ""
echo "🔧 Configure PM2 auto-startup (optional):"
echo "   sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u ikodioxlapo --hp /home/ikodioxlapo"
echo "   pm2 save"
echo ""
