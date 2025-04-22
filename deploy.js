require('dotenv').config();
const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

// Create a new SFTP client
const sftp = new Client();

// Define the local and remote paths
const localPath = path.join(__dirname, 'out'); // Next.js static export directory
const remotePath = '_cyrilflorita_v6'; // Update this to your remote path

// Connect to the SFTP server and upload files
sftp.connect({
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
})
.then(() => {
  console.log('Connected to SFTP server');
  return sftp.uploadDir(localPath, remotePath);
})
.then(() => {
  console.log('Upload completed successfully');
  return sftp.end();
})
.catch(err => {
  console.error('Error during deployment:', err);
  sftp.end();
});