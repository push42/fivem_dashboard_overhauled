// Function to calculate the time remaining until the next restart
// Modern Server Status and Restart Timer with ES6+ features
class ServerManager {
  constructor() {
    this.restartTimes = [0, 6, 12, 18, 24]; // Restart times in hours (24-hour format)
    this.timerInterval = null;
    this.statusCheckInterval = null;
    this.init();
  }

  init() {
    this.startRestartTimer();
    this.startStatusCheck();
  }

  startRestartTimer() {
    const updateTimer = () => {
      const now = new Date();
      const nextRestart = new Date(now);

      // Find next restart time
      for (const restartTime of this.restartTimes) {
        nextRestart.setHours(restartTime, 0, 0, 0);
        if (nextRestart > now) break;
        nextRestart.setDate(nextRestart.getDate() + 1);
      }

      const timeDiff = nextRestart - now;

      // Calculate hours, minutes, seconds
      const hours = Math.floor(timeDiff / 3600000);
      const minutes = Math.floor((timeDiff % 3600000) / 60000);
      const seconds = Math.floor((timeDiff % 60000) / 1000);

      // Format time string
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Update display
      const timerElement = document.getElementById('restart-timer');
      if (timerElement) {
        timerElement.textContent = formattedTime;
        timerElement.className = 'text-2xl font-mono font-bold text-primary-600';
      }
    };

    // Update immediately and then every second
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  async checkServerStatus(ip, port) {
    const timeout = 5000; // 5 seconds timeout
    const serverURL = `http://${ip}:${port}`;
    const statusCircle = document.getElementById('serverStatusCircle');
    const statusText = document.getElementById('serverStatusText');

    if (!statusCircle || !statusText) return;

    try {
      // Use fetch with timeout for modern browser support
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(serverURL, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Server is reachable
      this.updateServerStatus(true, statusCircle, statusText);
    } catch (error) {
      // Server is not reachable
      this.updateServerStatus(false, statusCircle, statusText);
    }
  }

  updateServerStatus(isOnline, statusCircle, statusText) {
    if (isOnline) {
      statusCircle.className =
        'w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50';
      statusText.textContent = 'Online';
      statusText.className = 'text-green-600 font-semibold';
    } else {
      statusCircle.className = 'w-4 h-4 bg-red-500 rounded-full';
      statusText.textContent = 'Offline';
      statusText.className = 'text-red-600 font-semibold';
    }
  }

  startStatusCheck() {
    // Check immediately and then every 30 seconds
    const serverIP = '127.0.0.1'; // Replace with actual server IP
    const serverPort = '30120'; // Replace with actual server port

    this.checkServerStatus(serverIP, serverPort);
    this.statusCheckInterval = setInterval(() => {
      this.checkServerStatus(serverIP, serverPort);
    }, 30000);
  }

  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }
}

// Modern heartbeat system
class HeartbeatManager {
  constructor() {
    this.heartbeatInterval = null;
    this.isActive = true;
    this.init();
  }

  init() {
    this.startHeartbeat();
    this.setupVisibilityHandler();
  }

  async sendHeartbeat() {
    try {
      const response = await fetch('/heartbeat.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Heartbeat failed');
      }
    } catch (error) {
      // Silently handle heartbeat errors
      // In production, you might want to implement retry logic
    }
  }

  startHeartbeat() {
    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (this.isActive) {
        this.sendHeartbeat();
      }
    }, 30000);
  }

  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;

      if (this.isActive) {
        // Send immediate heartbeat when tab becomes active
        this.sendHeartbeat();
      }
    });
  }

  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const serverManager = new ServerManager();
  const heartbeatManager = new HeartbeatManager();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    serverManager.destroy();
    heartbeatManager.destroy();
  });
});
function isServerOnline(ip, port) {
  const timeout = 2000;
  const serverURL = `http://${ip}:${port}`;
  const statusCircle = document.getElementById('serverStatusCircle');
  const statusText = document.getElementById('serverStatusText');

  statusText.innerHTML = 'Serverstatus: Serverdaten werden abgefragt...';

  const xhr = new XMLHttpRequest();
  xhr.open('GET', serverURL, true);
  xhr.timeout = timeout;

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      statusCircle.classList.add('online');
      statusCircle.classList.remove('offline');
      statusText.innerHTML = 'Serverstatus: Online';
    } else {
      statusCircle.classList.add('offline');
      statusCircle.classList.remove('online');
      statusText.innerHTML = 'Serverstatus: Offline';
    }
  };

  xhr.onerror = function () {
    statusCircle.classList.add('error');
    statusCircle.classList.remove('online', 'offline');
    statusText.innerHTML = 'Serverstatus: Wartungsarbeiten';
  };

  xhr.send();
}

const serverIP = 'your_server_ip_adress';
const serverPort = 'your_port_thats_open_to_listen_to';

document.addEventListener('DOMContentLoaded', function () {
  isServerOnline(serverIP, serverPort);
});
