
const fs = require('fs');
const path = require('path');
const metaDataPath = './metadata/'
const metaDataMap = fs.readdirSync(metaDataPath)

for (let file of metaDataMap) {
    let metadata = JSON.parse(fs.readFileSync(metaDataPath+file, 'utf8'));
    const index = parseInt(file.slice(0,-4))

    delete metadata.description;
    delete metadata.hash;

    var dir = './newMetadata/';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + (index).toString() + '.json', JSON.stringify(metadata), 'utf-8');

}

