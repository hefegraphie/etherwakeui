const express = require('express');
const fs = require('fs');
const path = require('path');
const ping = require('ping');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const commandsFilePath = path.join(__dirname, 'commands.json');

// Funktion zum Lesen der gespeicherten Rechner aus der JSON-Datei
function loadCommands() {
    if (fs.existsSync(commandsFilePath)) {
        try {
            const data = fs.readFileSync(commandsFilePath);
            return JSON.parse(data);
        } catch (error) {
            console.error('Fehler beim Lesen der Datei:', error);
            return [];
        }
    } else {
        return [];
    }
}

// Funktion zum Speichern der Rechner in der JSON-Datei
function saveCommands(commands) {
    try {
        fs.writeFileSync(commandsFilePath, JSON.stringify(commands, null, 2));
    } catch (error) {
        console.error('Fehler beim Schreiben der Datei:', error);
    }
}

// Funktion zum Ausführen eines lokalen Befehls
function executeLocalCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler beim Ausführen des Befehls: ${error}`);
            callback(`Fehler: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Fehlerausgabe: ${stderr}`);
            callback(`Fehlerausgabe: ${stderr}`);
            return;
        }
        callback(stdout);
    });
}

// Funktion für Ping
function startPing(ip, callback) {
    ping.sys.probe(ip, (isAlive) => {
        callback(isAlive);
    });
}

// Endpunkt zum Laden der gespeicherten Rechner
app.get('/get-commands', (req, res) => {
    try {
        const commands = loadCommands();
        res.json(commands);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Laden der Befehle' });
    }
});

// Endpunkt zum Hinzufügen eines neuen Rechners
app.post('/add-command', (req, res) => {
    const { name, ip, mac } = req.body;
    if (!name || !ip || !mac) {
        return res.status(400).json({ message: 'Name, IP-Adresse und MAC-Adresse sind erforderlich' });
    }
    const commands = loadCommands();
    commands.push({ name, ip, mac });
    saveCommands(commands);
    res.json({ message: 'Rechner hinzugefügt', commands });
});

// Endpunkt zum Löschen eines Rechners
app.post('/delete-command', (req, res) => {
    const { ip } = req.body;
    if (!ip) {
        return res.status(400).json({ message: 'IP-Adresse ist erforderlich' });
    }
    let commands = loadCommands();
    commands = commands.filter(command => command.ip !== ip);
    saveCommands(commands);
    res.json({ message: 'Rechner gelöscht', commands });
});

// Endpunkt zum Ausführen des Wake-on-LAN-Befehls und Pings
app.post('/execute-command', (req, res) => {
    const { ip, mac } = req.body;
    if (!ip || !mac) {
        return res.status(400).json({ message: 'IP-Adresse und MAC-Adresse sind erforderlich' });
    }

    const wolCommand = `etherwake ${mac}`;
    executeLocalCommand(wolCommand, (result) => {
        startPing(ip, (isAlive) => {
            if (isAlive) {
                res.json({ message: `Wake-on-LAN-Befehl gesendet. Rechner ist erreichbar.` });
            } else {
                res.json({ message: 'Wake-on-LAN-Befehl gesendet.' });
            }
        });
    });
});

// Starte den Server
app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});