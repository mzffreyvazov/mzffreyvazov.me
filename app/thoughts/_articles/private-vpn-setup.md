---
title: "Setting up a Private VPN Server for Free"
date: "2025.11.24"
tags:
    - programming
description: ""
hidden: false
---

# Setting up a Private VPN Server for Free

In this blog, I will explain how you can set up a private VPN server for your devices on DigitialOcean. For this purpose, I chose DigitalOcean because GitHub Student Pack offers a free $200 credits for one year (of course, this applies if you have a valid student email), which means it'll cost you no money to set up the server. 

Basic definitions before we begin: 
- DigitalOean: It is a cloud computing platform and infrastructure provider
- DigitalOcean Droplet: A Droplet is just a Virtual Private Server (VPS) or a Virtual Machine (VM) in DigitalOcean's platform. 
- VPN: Virtual Private Network is a tool used to create a secure, encrypted connection between your device and the internet. A VPN hides your real IP address and encrypts all the data you send and receive, making your online activity private and secure from third parties.
- VPS: Virtual Private Server is just a computer in a cloud, a virtual machine, which is sold as a service by a cloud or a web hosting provider. It has CPU, RAM, and Disk Space just like a normal computer.

::img{src="gemini-vpn-image.png" alt="VPN diagram" caption="How a VPN works"}

## Step 1: Setting up the droplet

First go to digitalocean.com, login to your account (or signup if you don't have any). Then you will be redirected to your dashboard, and will be shown a welcome page in which you can choose different products. Let's select Droplet. 

::img{src="Pasted image 20251127225232.png" alt="Droplet selection" caption="Droplet selection"}


Now follow these instructions step by step:
1. First we need to choose a region. You can choose whicevery you want, but it is best to choose a country that is closes to where you live. Lets choose Amsterdam. 
    ::img{src="Pasted image 20251127225609.png" alt="Region selection" caption="Region selection"}
2. You do not need to change Datacenter
3. Now we need to select an image. In this example we will continue with Ubuntu. Leave the latest version that is preselected for you. 
::img{src="Pasted image 20251127230328.png" alt="Ubuntu Image Selection" caption="Selecting the Ubuntu image — choose the latest stable/LTS release for best support and stability."}
4. Now let's choose the size. A basic droplet type will suffice us for now. 
   ::img{src="Pasted image 20251127230423.png" alt="Droplet size selection" caption="Choosing a basic droplet size"}
5. We do not need additional storage and backups
6. Now, we need to choose an authentication method, I suggest you to choose SSH key, which will make it a lot easier for us to connect to and work with the virtual machine. Follow the steps below to configure your SSH Authentication:
   ::img{src="Pasted image 20251127231150.png" alt="SSH Authentication" caption="SSH authentication method selection"}
	1. On your computer, open cmd and generate a SSH key pair
	   ```bash
	   ssh-keygen -t ed25519 
	   ```
		If this doesn't work, then try the full path:
		```bash
		C:\Windows\System32\OpenSSH\ssh-keygen -t ed25519
		```
	2. Then press enter to accept the default file path to save the keys. 
	3. Enter a strong passphrase when prompted.
	   
	   Congratulations: You now have your private and public keys. 
	4. In the same CMD window, use the `type` command to get the public key (you will put this on the VPS):
	   ```bash
	   type C:\Users\muzaf\.ssh\id_ed25519.pub
	   ```
	5. Copy the entire output, which will look like this: `ssh-ed25519 AAAA...[long_string_of_characters]...== user@hostname`
	6. On the Droplet creation page, click on `Add SSH Key`: 
	   ::img{src="Pasted image 20251127233000.png" alt="Add SSH Key button" caption="Click Add SSH Key"}
	7. Add the SSH key you previously copied in the opened window: 
	   ::img{src="Pasted image 20251127233109.png" alt="SSH key input window" caption="Paste your SSH public key"}
7. Once you set up the SSH authentication, click on `Create Droplet`:
   ::img{src="Pasted image 20251127233243.png" alt="Create Droplet button" caption="Click Create Droplet to finish setup"}
8. Congratulations, now you have your own VPS server. We will continue setting up and configuring the actual VPN server.
9. You can now connect to your VM using this command in CMD in your local machine:
   ```bash
   ssh root@your_droplet_ip_address
   ```
   Then enter the passphrase you set, then you will be connected.

## Step 2: Install WireGuard

**WireGuard** is a free and open-source **VPN (Virtual Private Network) protocol**. It is the industry standard due to its great focus on **simplicity, speed, and modern security**. You need a set of rules, a **protocol**, to create that secure, encrypted tunnel and WireGuard provides those. It uses state-of-the-art cryptography to ensure your connection is both secure and incredibly fast. The biggest advantage of WireGuard is its **simplicity**.

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

IP Forwarding, in simpler terms, is a core networking function that allows a device to act as a **router** or **gateway** between two different networks. We enable this, because we want the VPS to act as a router for us, which is necessary for the VPN that we are trying to set up. When enabled, our DigitalOcean Droplet receives a piece of data (called a "packet"), and then it checks the destination address (if it is disabled, it will just drop the packet): it uses its **routing table** to figure out the best way to relay or **forward** that packet to its intended destination **on a different network**. 

Here is how you enable IP Forwarding: 
```bash
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Step 4: Generate Client Keys

Now we need to generte client keys, the secure credentials your device will use to authenticate with the server. The key generation process is based on creating a public/private key pair for each client. This pair is fundamental to how WireGuard establishes a secure connection.

The example below shows how two seperate key pairs are created for two different device: 

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

## Step 5: Creating Server Configurations

This will make sure that the server will only accept traffic that has been cryptographically signed by the corresponding, secret **Private Key** held by that specific client.

```bash
# Stop current WireGuard service (if running)
sudo wg-quick down wg0

# Get original server keys
SERVER_PRIVATE_KEY=$(sudo cat privatekey)

# Create new server config with 3 clients
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

## Step 6: Create Client Configuration Files

 The Client Configuration Files are the final, ready-to-use credential files that you will transfer to your laptop, phone, or other device to connect to the VPN. This step means taking the unique keys and network settings generated on the server and packaging them into a single file with a `.conf` extension for each client.

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
Endpoint = 209.38.36.112:51820
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
Endpoint = 209.38.36.112:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF
```

## Step 7: Start WireGuard Server

In this step, we are finally done with the configuration, and starting the server.

```bash
# Start WireGuard
sudo wg-quick up wg0

# Enable on boot
sudo systemctl enable wg-quick@wg0

# Verify it's running
sudo wg show
```

## Step 8: Configure Firewall

```bash 
# Open WireGuard port
sudo ufw allow 51820/udp

# Verify firewall status
sudo ufw status
```

## Step 9: Download Client Configuration Files

Now, we need to download the `.conf` files from the remote server (your Droplet) to our local machine by using the **`scp` (Secure Copy Protocol)** command.

1. First close your terminal, then open a new one
2. You will use your server's public IP address, the user you use to SSH (e.g., root), and the specific file names. The files were saved in the home directory (~) on the server.
3. Then using the commands below, download both `.conf` files:
	```bash
	scp root@your_droplets_ip_address:~/client1.conf ./client1.conf
	scp root@your_droplets_ip_address:~/client2.conf ./client2.conf
	```

4. After entering the command, you will be prompted for your SSH password (or asked to use your SSH key if set up. The file will be copied to your current directory (./) on your local machine.
## Step 10: Set Up Client Devices
1. Download WireGuard from [wireguard.com](https://www.wireguard.com/install/)
2. Install and open the application
3. Click "Import tunnel(s) from file"
4. Select your `.conf` file
5. Click "Activate" to connect

## Glossary:
- Image: An Image is essentially a complete, pre-configured snapshot or blueprint of a virtual server's hard disk.  When you create a Droplet (or any Virtual Machine/VPS), you launch it from an image. It's a bundle of all the necessary software to run a server, including: Operating System (OS), File System Structure, Pre-Installed Software (i.e., Git), Configuration Settings (like server configurations, user settings, network settings, etc.).
- SSH: SSH (Secure Shell) is the primary protocol used to securely connect to and manage a Linux-based VPS or Droplet remotely. When you choose SSH Key, you are configuring the server to use **a pair of keys for authentication**:
	- Public Key: This key is placed on the server (your new Droplet). It's essentially a secure, public lock. The server uses this key to encrypt a challenge for anyone trying to connect.  
	- Private Key: This key stays securely on your local computer (in this example, "Muzeffer's Laptop"). It's the only key that can unlock the challenge sent by the server.
	  
	  When you try to connect, your laptop proves its identity to the server by using the private key to decrypt the challenge. Since no one else has your private key, access is granted automatically and securely without ever transmitting a password over the network.