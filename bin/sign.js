
const { exec } = require('child_process');
const path = require('path');
const sign = (query, userAgent) => {
    const scriptPath = path.join(__dirname, 'a_bogus.js');
    return new Promise((resolve, reject) => {
        exec(`node ${scriptPath} ${btoa(query)}`, (error, stdout, stderr) => {
            if (stdout) {
                resolve(stdout);
            } else {
                resolve(undefined);
            }
        });
    })
};


module.exports = {
    sign
};