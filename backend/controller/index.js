const fs = require('fs');
const path = require('path');

const controller = {}
fs.readdirSync(path.join(__dirname)).forEach(function(file){              
    const filename = file.split('.')[0];
    if(filename === 'index')return;
    controller[filename] = require(`./${file}`);
});
module.exports = controller;