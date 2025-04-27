const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // IPC communication
    receive: (channel, func) => {
      const validChannels = ['action', 'file-opened'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    // File handling
    saveDialog: async (defaultPath) => {
      return await ipcRenderer.invoke('save-dialog', defaultPath);
    },

    saveFile: async (filePath, content) => {
      return await ipcRenderer.invoke('save-file', { filePath, content });
    },

    readFile: (filePath) => {
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        console.error('Failed to read file:', err);
        return null;
      }
    },

    // System info
    getSystemInfo: () => {
      return {
        platform: process.platform,
        arch: process.arch,
        cpus: os.cpus().length,
        memory: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // GB
        hostname: os.hostname(),
        userInfo: os.userInfo().username
      };
    },

    // Execute shell commands (with restrictions for security)
    executeCommand: (command) => {
      try {
        // Whitelist allowed commands for security
        const allowedCommands = ['ls', 'dir', 'echo', 'pwd', 'whoami', 'date'];

        // Check if the command is in the allowed list
        const commandName = command.split(' ')[0];
        if (!allowedCommands.includes(commandName)) {
          return `Error: Command '${commandName}' is not allowed for security reasons.`;
        }

        // Execute the command
        const result = childProcess.execSync(command, { encoding: 'utf8' });
        return result;
      } catch (err) {
        return `Error executing command: ${err.message}`;
      }
    }
  }
);