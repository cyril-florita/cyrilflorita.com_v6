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
.then(() => {  // List the files in the remote directory to verify upload
  console.log('Verifying uploaded files...');
  return sftp.list(remotePath);
})
.then(fileList => {
  console.log(`Found ${fileList.length} files/directories in the remote location`);
})
.then(() => {
  // Log deployment timestamp
  const deploymentLog = `Deployment completed at ${new Date().toISOString()}\n`;
  const tempLogFile = path.join(__dirname, 'deploy-log-temp.txt');
  
  fs.writeFileSync(tempLogFile, deploymentLog);
  console.log('Updating deployment log...');
  
  return sftp.put(tempLogFile, `${remotePath}/deployment-log.txt`)
    .then(() => {
      fs.unlinkSync(tempLogFile); // Clean up temp file
    });
})
.then(() => {
  console.log('Deployment process completed successfully');
  return sftp.end();
})
.catch(err => {
  console.error('Error during deployment:', err);
  sftp.end();
});