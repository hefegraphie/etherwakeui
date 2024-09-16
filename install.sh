#!/bin/bash

# Konfigurierbare Variablen
PROJECT_NAME="etherwakeui"
GITHUB_REPO="https://github.com/hefegraphie/etherwakeui.git"  # Ersetze 'username' mit deinem GitHub-Benutzernamen

# Update Paketlisten und installiere Abhängigkeiten
echo "Paketlisten aktualisieren..."
apt update

echo "Installiere curl, gnupg, git und npm..."
apt install curl gnupg git -y

# Node.js installieren
echo "Node.js installieren..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installiere etherwake
echo "etherwake installieren..."
apt install etherwake -y

# Erstelle das Projektverzeichnis, falls nicht vorhanden
if [ ! -d "$PROJECT_NAME" ]; then
    echo "Projektverzeichnis $PROJECT_NAME erstellen..."
    mkdir "$PROJECT_NAME"
fi

# Ins Projektverzeichnis wechseln
cd "$PROJECT_NAME"

# Projekt von GitHub klonen
if [ ! -d ".git" ]; then
    echo "Projekt von GitHub klonen..."
    git clone "$GITHUB_REPO" .
else
    echo "Projektverzeichnis existiert bereits, überspringe das Klonen..."
fi

# Installiere npm-Abhängigkeiten, inklusive express, ping und child_process
echo "npm-Abhängigkeiten installieren (express, ping, child_process)..."
npm install express ping child_process

# Starte den Node.js-Server
echo "Node.js-Server starten..."
node server.js