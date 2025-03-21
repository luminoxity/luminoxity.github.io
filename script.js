// Server address - change this to your own server
const SERVER_ADDRESS = 'mc.r67u.com';
const SERVER_PORT = 25565; // Default Minecraft port, change if needed

// API URL for Minecraft server status (using mcapi.us service)
const API_URL = `https://mcapi.us/server/status?ip=${SERVER_ADDRESS}&port=${SERVER_PORT}`;

// Elements
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const playersOnline = document.getElementById('players-online');
const playerList = document.getElementById('player-list');
const serverVersion = document.getElementById('server-version');
const uptime = document.getElementById('uptime');
const motd = document.getElementById('motd');

// Function to fetch server stats
async function fetchServerStats() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Update server status
        if (data.online) {
            statusIndicator.className = 'online';
            statusText.textContent = 'Online';
            
            // Update players
            const playerCount = data.players.now;
            playersOnline.textContent = `${playerCount} / ${data.players.max}`;
            
            // Update player list if available
            if (data.players.sample && data.players.sample.length > 0) {
                const playerNames = data.players.sample.map(player => player.name).join(', ');
                playerList.textContent = `Online: ${playerNames}`;
            } else {
                playerList.textContent = playerCount > 0 ? 'Players online' : 'No players online';
            }
            
            // Update server version
            serverVersion.textContent = data.server.name;
            
            // Update MOTD (Message of the Day)
            if (data.motd) {
                motd.textContent = data.motd.replace(/§[0-9a-fk-or]/g, ''); // Remove Minecraft color codes
            }
            
            // Calculate and display uptime (This is not provided by the API, so it's just a placeholder)
            // For actual uptime, you would need your own backend service
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            uptime.textContent = `Last checked: ${hours}:${minutes}`;
        } else {
            setOfflineStatus();
        }
    } catch (error) {
        console.error('Error fetching server stats:', error);
        setOfflineStatus();
    }
}

// Set offline status
function setOfflineStatus() {
    statusIndicator.className = 'offline';
    statusText.textContent = 'Offline';
    playersOnline.textContent = '0 / 0';
    playerList.textContent = 'Server is offline';
    serverVersion.textContent = 'N/A';
    uptime.textContent = 'N/A';
    motd.textContent = 'Server is currently offline';
}

// Function to copy server IP to clipboard
function copyIP() {
    const serverIP = document.getElementById('server-ip').textContent;
    
    navigator.clipboard.writeText(serverIP)
        .then(() => {
            // Add a temporary "Copied!" message
            const copyButton = document.getElementById('copy-ip');
            const originalContent = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyButton.innerHTML = originalContent;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy IP address:', err);
        });
}

// Make the copyIP function global so the onclick attribute works
window.copyIP = copyIP;

// Fetch server stats when page loads
fetchServerStats();

// Refresh server stats every 5 minutes
setInterval(fetchServerStats, 5 * 60 * 1000);
