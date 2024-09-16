#!/bin/bash

# Update package lists
apt update

# Install necessary packages
apt install -y curl git nodejs npm etherwake

# Install dotenv package globally
npm install -g dotenv

# Clone the project repository
git clone https://github.com/hefegraphie/etherwakeui.git /opt/etherwakeui
cd /opt/etherwakeui

# Install project dependencies
npm install

# Create a systemd service file for the Node.js server
cat <<EOF | sudo tee /etc/systemd/system/etherwakeui.service
[Unit]
Description=Etherwake UI Server
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/etherwakeui/server.js
WorkingDirectory=/opt/etherwakeui
Restart=always
User=$(whoami)
Group=$(whoami)
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Replace /path/to/etherwakeui with the actual path to your project directory
sudo sed -i "s|/opt/etherwakeui|$(pwd)|g" /etc/systemd/system/etherwakeui.service

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Start the service
sudo systemctl start etherwakeui

# Enable the service to start on boot
sudo systemctl enable etherwakeui

echo "Installation und Konfiguration abgeschlossen. Der Server läuft jetzt als Dienst."