import { create, globSource } from "ipfs-http-client";
// const ipfsGateway = "https://ipfs.io/ipfs/";
import fs from 'fs'
import path from 'path'
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

const addOptions = {
    pin: true,
};

const uploadImage = async () => {
    const dict = {}
    for await (const file of ipfs.addAll(globSource('./images', '**/*'), addOptions)) {
        const { path, cid } = file
        const index = path.split('.')[0]
        dict[index] = cid.toString()
    }
    return dict
}

const main = async () => {
    const dict = await uploadImage()
    const fileNames = fs.readdirSync('./metadata')
    const metaDataList = []
    for (let fileName of fileNames) {
        if (fileName != '.DS_Store') {
            let metaData = JSON.parse(fs.readFileSync('./metadata/'+fileName),'utf-8')
            let index = fileName.split('.')[0]
            metaData.image = 'ipfs://'+dict[index]
            metaDataList.push(metaData)
            var dir = './temp'
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFileSync(dir +'/'+ index.toString() + '.json', JSON.stringify(metaData), 'utf-8');
        }

    }

    const {cid} = await ipfs.add(globSource('./temp', '**/*'),{
        pin: true,
        wrapWithDirectory: true
    })
    const output = {baseURI:'ipfs://'+cid.toString()}
    fs.writeFileSync('baseURI.json', JSON.stringify(output),'utf-8')
    fs.rmSync(dir, { recursive: true });
}
main()