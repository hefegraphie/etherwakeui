# EtherwakeUI

EtherwakeUI is a simple web-based interface to send Wake-on-LAN (WoL) packets and check the status of network devices using ping. It allows you to wake up and manage devices in your network from an easy-to-use web UI.

## Features

- Wake-on-LAN (WoL) functionality to wake up devices on your network.
- Ping functionality to check if a device is online or offline.
- Add and delete devices from the web UI.
- Automatically checks the online status of devices.

## Prerequisites

- **Ubuntu/Debian-based system** (other Linux systems should work with slight modifications).
- **Node.js** (v18 or higher).
- **Etherwake** for sending Wake-on-LAN packets.

## Installation

You can set up EtherwakeUI quickly by running an installation script. Follow these steps:

### Step 1: Prepare Your Server

Before you can install the EtherwakeUI project, ensure that your system has `curl` and package lists are updated.

```bash
sudo apt update
sudo apt install curl -y
```

### Step 2: Clone and Run the Installation Script

Once `curl` is installed, you can download and run the installation script, which will take care of the entire setup.

```bash
curl -o install.sh https://raw.githubusercontent.com/hefegraphie/etherwakeui/main/install.sh
chmod +x install.sh
./install.sh
```

This script will:

1. Clone the EtherwakeUI project from GitHub.
2. Install Node.js and required npm packages (`express`, `ping`, `child_process`).
3. Install `etherwake` to send WoL packets.
4. Set up and run the web server on port 3000.

If you prefer not to use the automated installation script, you can manually set up the project as follows:

1. **Update your system and install required packages:**

    ```bash
    sudo apt update
    sudo apt install curl git nodejs npm -y
    ```

2. **Create a project directory and navigate into it:**

    ```bash
    mkdir etherwakeui
    cd etherwakeui
    ```

3. **Clone the project from GitHub:**

    ```bash
    git clone https://github.com/username/etherwakeui.git .
    ```

4. **Create a `package.json` file:**

    Create a file named `package.json` in the project directory with the following content:

    ```json
    {
      "name": "etherwakeui",
      "version": "1.0.0",
      "description": "A web interface for Wake-on-LAN functionality using Node.js and Express.",
      "main": "server.js",
      "scripts": {
        "start": "node server.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "ping": "^0.2.2"
      },
      "author": "Your Name",
      "license": "MIT"
    }
    ```

5. **Install the dependencies:**

    ```bash
    npm install
    ```

6. **Start the server:**

    ```bash
    npm start
    ```

## Automatic Server Startup

To ensure the server starts automatically after a reboot, follow these steps:

1. **Create a systemd service file:**

    Create a file `/etc/systemd/system/etherwakeui.service` with the following content:

    ```ini
    [Unit]
    Description=Etherwake UI Server
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /root/etherwakeui/server.js
    WorkingDirectory=/root/etherwakeui
    Restart=always
    User=root

    [Install]
    WantedBy=multi-user.target
    ```

2. **Enable and start the service:**

    ```bash
    sudo systemctl enable etherwakeui
    sudo systemctl start etherwakeui
    ```

## Usage

Once the server is running:

1. Open your web browser and navigate to `http://<your-server-ip>:3000`.
2. Use the web UI to add devices (Name, IP Address, and MAC Address).
3. Click "Wake-on-LAN" to send a WoL packet to a device.
4. The status of the device (online or offline) will be displayed based on ping results. Side refresh is mandatory.

## Project Structure

```
etherwakeui/
├── public/                   # Static files (HTML, CSS, JavaScript)
├── server.js                 # Main server-side script (Express.js)
├── install.sh                # Installation script
├── package.json              # Node.js dependencies and scripts
└── README.md                 # Project documentation

```

## License

This project is licensed under the MIT License.
