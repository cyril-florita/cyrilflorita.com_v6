const Client = require('ssh2-sftp-client');
require('dotenv').config();

async function deploy() {
    const sftp = new Client();
    try {
        await sftp.connect({
            host: process.env.IONOS_FTP_HOST,
            port: 22,
            username: process.env.IONOS_FTP_USER,
            password: process.env.IONOS_FTP_PASSWORD
        });
        
        console.log('Starting deployment...');
        await sftp.uploadDir(__dirname + '/out', '/_cyrilflorita_v6');
        console.log('Deployment completed successfully!');
    }
    catch(err) {
        console.log('Deployment failed:', err);
    }
    finally {
        sftp.end();
    }
}

deploy();