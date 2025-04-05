const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
require('dotenv').config();

const config = {
    user: process.env.IONOS_FTP_USER,
    password: process.env.IONOS_FTP_PASSWORD,
    host: process.env.IONOS_FTP_HOST,
    port: 22,
    localRoot: __dirname + "/.next/out",
    remoteRoot: "/cyrilflorita",
    include: ["*", "**/*"],
    exclude: [
        "node_modules/**",
        ".git/**",
        ".github/**",
        ".next/**"
    ],
    deleteRemote: false,
    forcePasv: true
};

ftpDeploy
    .deploy(config)
    .then(res => console.log("Deployment completed successfully!"))
    .catch(err => console.log(err));