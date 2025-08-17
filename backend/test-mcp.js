#!/usr/bin/env node

import { spawn } from 'child_process';

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYzBhMWYwZC1lNjMwLTQxZDctYjM5Ny1jMTgxYmFjMzc2ZTQiLCJlbWFpbCI6Im1jcHRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTUzNzY0NDEsImV4cCI6MTc1NTk4MTI0MSwiYXVkIjoiZmluYW5jZS10cmFja2VyLWFwcCIsImlzcyI6ImZpbmFuY2UtdHJhY2tlciJ9.jpNSJmhV5LlpAMd7DY9HqdGNimu7rs6IPv1YTqkZ6xs";

// Start the MCP server
const mcpServer = spawn('bun', ['run', 'src/mcp-server.ts'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let messageId = 1;

function sendMessage(method, params = {}) {
  const message = {
    jsonrpc: "2.0",
    id: messageId++,
    method,
    params
  };
  
  console.log('Sending:', JSON.stringify(message));
  mcpServer.stdin.write(JSON.stringify(message) + '\n');
}

function sendNotification(method, params = {}) {
  const message = {
    jsonrpc: "2.0",
    method,
    params
  };
  
  console.log('Sending notification:', JSON.stringify(message));
  mcpServer.stdin.write(JSON.stringify(message) + '\n');
}

mcpServer.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('Received:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Raw output:', line);
    }
  });
});

mcpServer.stderr.on('data', (data) => {
  console.log('Error:', data.toString());
});

mcpServer.on('close', (code) => {
  console.log(`MCP server exited with code ${code}`);
});

// Initialize the connection
setTimeout(() => {
  console.log('Initializing MCP connection...');
  
  // Send initialize request
  sendMessage('initialize', {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  });
}, 100);

// Test sequence
setTimeout(() => {
  // Send initialized notification
  sendNotification('notifications/initialized');
  
  // List tools
  sendMessage('tools/list');
  
  // Test get_user_profile
  sendMessage('tools/call', {
    name: 'get_user_profile',
    arguments: {
      token: JWT_TOKEN
    }
  });
  
  // Test create_entity
  sendMessage('tools/call', {
    name: 'create_entity',
    arguments: {
      token: JWT_TOKEN,
      name: 'My Personal Finance',
      type: 'bank'
    }
  });
  
}, 1000);

// Close after 10 seconds
setTimeout(() => {
  mcpServer.kill();
}, 10000);