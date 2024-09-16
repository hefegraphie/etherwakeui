const express = require('express');
const fs = require('fs');
const path = require('path');
const ping = require('ping');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const commandsFilePath = path.join(__dirname, 'commands.json');

// Function to load commands from JSON file
function loadCommands() {
    if (fs.existsSync(commandsFilePath)) {
        try {
            const data = fs.readFileSync(commandsFilePath);
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    } else {
        return [];
    }
}

// Function to save commands to JSON file
function saveCommands(commands) {
    try {
        fs.writeFileSync(commandsFilePath, JSON.stringify(commands, null, 2));
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

// Function to execute a local command
function executeLocalCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            callback(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr output: ${stderr}`);
            callback(`Stderr output: ${stderr}`);
            return;
        }
        callback(stdout);
    });
}

// Function for Ping
function startPing(ip, callback) {
    ping.sys.probe(ip, (isAlive) => {
        callback(isAlive);
    });
}

// Endpoint to load saved commands
app.get('/get-commands', (req, res) => {
    try {
        const commands = loadCommands();
        res.json(commands);
    } catch (error) {
        res.status(500).json({ message: 'Error loading commands' });
    }
});
 
// Endpoint to add a new command
app.post('/add-command', (req, res) => {
    const { name, ip, mac } = req.body;
    if (!name || !ip || !mac) {
        return res.status(400).json({ message: 'Name, IP address, and MAC address are required' });
    }
    const commands = loadCommands();
    commands.push({ name, ip, mac });
    saveCommands(commands);
    res.json({ message: 'Command added', commands });
});

// Endpoint to delete a command
app.post('/delete-command', (req, res) => {
    const { ip } = req.body;
    if (!ip) {
        return res.status(400).json({ message: 'IP address is required' });
    }
    let commands = loadCommands();
    commands = commands.filter(command => command.ip !== ip);
    saveCommands(commands);
    res.json({ message: 'Command deleted', commands });
});

// Endpoint to execute Wake-on-LAN command and ping
app.post('/execute-command', (req, res) => {
    const { ip, mac } = req.body;
    if (!ip || !mac) {
        return res.status(400).json({ message: 'IP address and MAC address are required' });
    }

    const wolCommand = `etherwake ${mac}`;
    executeLocalCommand(wolCommand, (result) => {
        startPing(ip, (isAlive) => {
            if (isAlive) {
                res.json({ message: `Wake-on-LAN command sent. Device is reachable.` });
            } else {
                res.json({ message: 'Wake-on-LAN command sent.' });
            }
        });
    });
});

// Endpoint to ping a host
app.post('/ping-host', (req, res) => {
    const { ip } = req.body;
    if (!ip) {
        return res.status(400).json({ message: 'IP address is required' });
    }

    startPing(ip, (isAlive) => {
        res.json({ message: isAlive ? 'Device is reachable' : 'Device is not reachable' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
