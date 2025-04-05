const Client = require('ssh2-sftp-client');
require('dotenv').config();

async function testConnection() {
    const sftp = new Client();
    try {
        await sftp.connect({
            host: process.env.IONOS_FTP_HOST,
            port: 22,
            username: process.env.IONOS_FTP_USER,
            password: process.env.IONOS_FTP_PASSWORD
        });
        console.log("Connection successful!");
        const list = await sftp.list('/');
        console.log(list);
    }
    catch(err) {
        console.log("Connection failed:", err);
    }
    finally {
        sftp.end();
    }
}

testConnection();