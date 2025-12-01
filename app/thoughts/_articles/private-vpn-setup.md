---
title: "Setting up a Private VPN Server for Free"
date: "2025.12.01"
tags:
    - programming
description: "A step-by-step guide on setting up a private VPN server using DigitalOcean and WireGuard."
hidden: false
---

# Setting up a Private VPN Server for Free

In this blog post, I will explain how you can set up a private VPN server for your devices on DigitalOcean. For this purpose, I chose DigitalOcean because the [GitHub Student Pack](https://education.github.com/pack) offers **$200 in free credits** for one year (of course, this applies if you have a valid student email), which means it'll cost you no money to set up the server.

Basic definitions before we begin:
- **DigitalOcean**: A cloud computing platform and infrastructure provider.
- **DigitalOcean Droplet**: A Droplet is just a Virtual Private Server (VPS) or a Virtual Machine (VM) on DigitalOcean's platform.
- **VPN**: A Virtual Private Network is a tool used to create a secure, encrypted connection between your device and the internet. A VPN hides your real IP address and encrypts all the data you send and receive, making your online activity private and secure from third parties.
- **VPS**: A Virtual Private Server is just a computer in the cloud (a virtual machine) which is sold as a service by a cloud or web hosting provider. It has CPU, RAM, and Disk Space just like a normal computer.

::img{src="gemini-vpn-image.png" alt="VPN diagram" caption="How a VPN works"}

## Step 1: Setting up the Droplet

First, go to [digitalocean.com](https://digitalocean.com) and log in to your account (or sign up if you don't have one). You will be redirected to your dashboard and shown a welcome page where you can choose different products. Let's select **Droplet**.

::img{src="Pasted image 20251127225232.png" alt="Droplet selection" caption="Droplet selection"}

Now follow these instructions step by step:

1. First, we need to choose a region. You can choose whichever you want, but it is best to choose a country that is closest to where you live. Let's choose Amsterdam.
   ::img{src="Pasted image 20251127225609.png" alt="Region selection" caption="Region selection"}
2. You do not need to change the Datacenter.
3. Now we need to select an [image](#glossary). In this example, we will continue with Ubuntu. Leave the latest version that is preselected for you. 
   ::img{src="Pasted image 20251127230328.png" alt="Ubuntu Image Selection" caption="Selecting the Ubuntu image"}
4. Now let's choose the size. A basic droplet type will suffice for now. 
   ::img{src="Pasted image 20251127230423.png" alt="Droplet size selection" caption="Choosing a basic droplet size"}
5. We do not need additional storage and backups.
6. Now, we need to choose an authentication method. I suggest you choose [SSH](#glossary) key, which will make it a lot easier for us to connect to and work with the virtual machine. Follow the steps below to configure your SSH Authentication:
   ::img{src="Pasted image 20251201192914.png" alt="SSH Authentication" caption="SSH authentication method selection"}
    1. On your computer, open a terminal and generate an SSH key pair:
       ```bash
       ssh-keygen -t [ALGORITHM] -C "[YOUR COMMENT]" -f [PATH/YOUR_FILE_NAME]
       ```
       
       **Windows (CMD):**
       ```bash
       ssh-keygen -t ed25519 -C "test-vpn-setup" -f %USERPROFILE%\.ssh\test-vpn-setup-key
       ```
       If this doesn't work, try the full path:
       ```bash
       C:\Windows\System32\OpenSSH\ssh-keygen -t ed25519 -C "test-vpn-setup" -f %USERPROFILE%\.ssh\test-vpn-setup-key
       ```
       
       **Linux/macOS (Terminal):**
       ```bash
       ssh-keygen -t ed25519 -C "test-vpn-setup" -f ~/.ssh/test-vpn-setup-key
       ```
    2. Enter a strong passphrase when prompted:
       ::img{src="Pasted image 20251201191417.png" alt="Passphrase prompt" caption="Enter a strong passphrase"}
       Congratulations! You now have your private and public keys. 
    3. In the same terminal window, display the public key (you will put this on the VPS):
       
       **Windows (CMD):**
       ```bash
       type %USERPROFILE%\.ssh\test-vpn-setup-key.pub
       ```
       
       **Linux/macOS (Terminal):**
       ```bash
       cat ~/.ssh/test-vpn-setup-key.pub
       ```
    4. Copy the entire output, which will look like this: `ssh-ed25519 AAAA...[long_string_of_characters]...== user@hostname`
       ::img{src="Pasted image 20251201191650.png" alt="Public key output" caption="Copy the entire public key output"}
    5. On the Droplet creation page, click on `Add SSH Key`: 
       ::img{src="Pasted image 20251127233000.png" alt="Add SSH Key button" caption="Click Add SSH Key"}
    6. Add the SSH key you previously copied in the opened window: 
       ::img{src="Pasted image 20251127233109.png" alt="SSH key input window" caption="Paste your SSH public key"}
7. Once you set up the SSH authentication, click on `Create Droplet`:
   ::img{src="Pasted image 20251127233243.png" alt="Create Droplet button" caption="Click Create Droplet to finish setup"}
8. Congratulations! Now you have your own VPS. We will continue setting up and configuring the actual VPN server.
9. You can now connect to your VM using this command in your terminal:
   
   **Note: Replace `YOUR_DROPLET_IP` with your actual Droplet IP address.**

   **Windows (CMD):**
   ```bash
   C:\Windows\System32\OpenSSH\ssh -i %USERPROFILE%\.ssh\test-vpn-setup-key root@YOUR_DROPLET_IP
   ```
   
   **Linux/macOS (Terminal):**
   ```bash
   ssh -i ~/.ssh/test-vpn-setup-key root@YOUR_DROPLET_IP
   ```
   
   Then enter the passphrase you set, and you will be connected.
   ::img{src="Pasted image 20251201192453.png" alt="SSH connection" caption="Connected to your VPS"}


## Step 2: Install WireGuard

**WireGuard** is a free and open-source **VPN (Virtual Private Network) protocol**. It is the industry standard due to its focus on **simplicity, speed, and modern security**. You need a set of rules (a protocol) to create a secure, encrypted tunnel, and WireGuard provides exactly that. It uses state-of-the-art cryptography to ensure your connection is both secure and incredibly fast. The biggest advantage of WireGuard is its **simplicity**.

Follow the instructions below to install WireGuard:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install WireGuard
sudo apt install wireguard -y

# Generate server keys
cd /etc/wireguard
sudo wg genkey | sudo tee privatekey | wg pubkey | sudo tee publickey
```

## Step 3: Enable IP Forwarding

IP Forwarding is a core networking function that allows a device to act as a **router** or **gateway** between two different networks. We enable this because we want the VPS to act as a router for us, which is necessary for the VPN setup. When enabled, our DigitalOcean Droplet receives a piece of data (called a "packet") and checks the destination address. It uses its **routing table** to figure out the best way to relay or **forward** that packet to its intended destination **on a different network**.

Here is how you enable IP Forwarding:
```bash
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Step 4: Generate Client Keys

Now we need to generate client keys, the secure credentials your device will use to authenticate with the server. The key generation process is based on creating a public/private key pair for each client. This pair is fundamental to how WireGuard establishes a secure connection.

The example below shows how two separate key pairs are created for two different devices:

```bash
cd /etc/wireguard

# Generate keys for client #1
CLIENT_1_PRIVATE_KEY=$(wg genkey)
CLIENT_1_PUBLIC_KEY=$(echo "$CLIENT_1_PRIVATE_KEY" | wg pubkey)

# Generate keys for client #2
CLIENT_2_PRIVATE_KEY=$(wg genkey)
CLIENT_2_PUBLIC_KEY=$(echo "$CLIENT_2_PRIVATE_KEY" | wg pubkey)

# Display all keys for reference
echo "=== CLIENT 1 KEYS ==="
echo "Private: $CLIENT_1_PRIVATE_KEY"
echo "Public: $CLIENT_1_PUBLIC_KEY"
echo ""
echo "=== CLIENT 2 KEYS ==="
echo "Private: $CLIENT_2_PRIVATE_KEY"
echo "Public: $CLIENT_2_PUBLIC_KEY"
```

::img{src="Pasted image 20251201200110.png" alt="Generated client keys" caption="Generated client keys for two devices"}

## Step 5: Creating Server Configurations

This ensures that the server will only accept traffic that has been cryptographically signed by the corresponding secret **Private Key** held by that specific client.

```bash
# Stop current WireGuard service (if running)
sudo wg-quick down wg0

# Get original server keys
SERVER_PRIVATE_KEY=$(sudo cat privatekey)

# Create new server config with 2 clients
sudo tee /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $SERVER_PRIVATE_KEY
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = $CLIENT_1_PUBLIC_KEY
AllowedIPs = 10.0.0.2/32

[Peer]
PublicKey = $CLIENT_2_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32

EOF
```

::img{src="Pasted image 20251201200431.png" alt="Server configuration file" caption="Server configuration file with two clients"}

## Step 6: Create Client Configuration Files

Client configuration files are the final, ready-to-use credential files that you will transfer to your laptop, phone, or other device to connect to the VPN. This step packages the unique keys and network settings generated on the server into a single file with a `.conf` extension for each client.

**Note: Replace `YOUR_DROPLET_IP` with the actual IP address of your DigitalOcean Droplet.**

For `CLIENT_1`:
```bash
# 1. Load the server's public key into a variable 
SERVER_PUBLIC_KEY=$(sudo cat publickey)

# 2. Create the client configuration file
tee ~/client1.conf << EOF
[Interface]
PrivateKey = $CLIENT_1_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = $SERVER_PUBLIC_KEY
Endpoint = YOUR_DROPLET_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF
```

For `CLIENT_2`:
```bash
# 1. Load the server's public key into a variable from the saved file
SERVER_PUBLIC_KEY=$(sudo cat publickey)

# 2. Create the client configuration file
tee ~/client2.conf << EOF
[Interface]
PrivateKey = $CLIENT_2_PRIVATE_KEY
Address = 10.0.0.3/24
DNS = 8.8.8.8

[Peer]
PublicKey = $SERVER_PUBLIC_KEY
Endpoint = YOUR_DROPLET_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF
```
::img{src="Pasted image 20251201201021.png" alt="Client configuration files" caption="Generated client configuration files"}

**Note: Make sure to replace `YOUR_DROPLET_IP` with the actual IP address of your DigitalOcean Droplet in both client configuration files.**

## Step 7: Start WireGuard Server

In this step, we are finally done with the configuration and are starting the server.

```bash
# Start WireGuard
sudo wg-quick up wg0

# Enable on boot
sudo systemctl enable wg-quick@wg0

# Verify it's running
sudo wg show
```
::img{src="Pasted image 20251201201319.png" alt="WireGuard status" caption="WireGuard server is up and running"}

## Step 8: Configure Firewall

```bash 
# Open WireGuard port
sudo ufw allow 51820/udp

# Verify firewall status
sudo ufw status

# Allow SSH (do this BEFORE enabling UFW)
sudo ufw allow 22/tcp

# Then enable the firewall
sudo ufw enable
```

You'll see a prompt like:

```txt
Command may disrupt existing ssh connections. Proceed with operation (y|n)?


Type `y` and press Enter.

Now when you check the status, you should see:

Status: active

To                         Action      From
--                         ------      ----
51820/udp                  ALLOW       Anywhere
51820/udp (v6)             ALLOW       Anywhere (v6)

```

::img{src="Pasted image 20251201201959.png" alt="Firewall status" caption="Firewall configured to allow WireGuard and SSH traffic"}

## Step 9: Download Client Configuration Files

Now, we need to download the `.conf` files from the remote server (your Droplet) to our local machine using the **`scp` (Secure Copy Protocol)** command.

1. Open a new terminal window or Command Prompt **on your local computer**.
2. You will use your server's public IP address, the user you use to SSH (e.g., root), and the specific file names. The files were saved in the home directory (~) on the server.
3. Run the following commands to download both `.conf` files (replace `YOUR_DROPLET_IP` with your actual IP):

   **Windows (CMD):**
   ```bash
   C:\Windows\System32\OpenSSH\scp -i %USERPROFILE%\.ssh\test-vpn-setup-key root@YOUR_DROPLET_IP:~/client1.conf %USERPROFILE%\Downloads\client1.conf

   C:\Windows\System32\OpenSSH\scp -i %USERPROFILE%\.ssh\test-vpn-setup-key root@YOUR_DROPLET_IP:~/client2.conf %USERPROFILE%\Downloads\client2.conf
   ```
   
   **Linux/macOS (Terminal):**
   ```bash
   scp -i ~/.ssh/test-vpn-setup-key root@YOUR_DROPLET_IP:~/client1.conf ~/Downloads/client1.conf

   scp -i ~/.ssh/test-vpn-setup-key root@YOUR_DROPLET_IP:~/client2.conf ~/Downloads/client2.conf
   ```

4. After entering the command, you will be prompted for your SSH passphrase (or asked to use your SSH key if set up). The file will be copied to your Downloads folder on your local machine.

::img{src="Pasted image 20251201202658.png" alt="SCP file transfer" caption="Downloading client configuration files using SCP"}

::img{src="Pasted image 20251201202919.png" alt="Downloaded configuration files" caption="Client configuration files downloaded to local machine"}

## Step 10: Set Up Client Devices
1. Download WireGuard from [wireguard.com](https://www.wireguard.com/install/)
2. Install and open the application.
3. Click "Import tunnel(s) from file".
4. Select your `.conf` file.
5. Click "Activate" to connect.

   ::img{src="Pasted image 20251201203223.png" alt="Import tunnel" caption="Importing tunnel configuration in WireGuard client"}

	::img{src="Pasted image 20251201212816.png" alt="WireGuard client interface" caption="WireGuard client interface after importing configuration"}

## Step 11: Verify Connection
To verify that your VPN connection is active and working correctly, you can check your IP address before and after connecting to the VPN.
1. Before connecting to the VPN, visit [whatismyipaddress.com](https://whatismyipaddress.com/) to see your current public IP address.

::img{src="Pasted image 20251201203742.png" alt="IP address before VPN" caption="Checking IP address before connecting to VPN"}

2. Connect to the VPN using the WireGuard client.
3. After connecting, revisit [whatismyipaddress.com](https://whatismyipaddress.com/) to see if your IP address has changed to the one assigned by your VPN server.

::img{src="Pasted image 20251201203638.png" alt="IP address verification" caption="Verifying IP address change after connecting to VPN. Since we created the server in Amsterdam, the IP reflects that location."}
## Glossary
- **Image**: An Image is essentially a complete, pre-configured snapshot or blueprint of a virtual server's hard disk. When you create a Droplet (or any Virtual Machine/VPS), you launch it from an image. It's a bundle of all the necessary software to run a server, including: Operating System (OS), File System Structure, Pre-Installed Software (i.e., Git), and Configuration Settings.
- **SSH**: SSH (Secure Shell) is the primary protocol used to securely connect to and manage a Linux-based VPS or Droplet remotely. When you choose SSH Key, you are configuring the server to use **a pair of keys for authentication**:
	- **Public Key**: This key is placed on the server (your new Droplet). It's essentially a secure, public lock. The server uses this key to encrypt a challenge for anyone trying to connect.
	- **Private Key**: This key stays securely on your local computer (e.g., "Your Laptop"). It's the only key that can unlock the challenge sent by the server.
	  
	  When you try to connect, your laptop proves its identity to the server by using the private key to decrypt the challenge. Since no one else has your private key, access is granted automatically and securely without ever transmitting a password over the network.