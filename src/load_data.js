import fs from 'node:fs/promises';
import * as shop from './shop.js';

const UPLOADS_FOLDER = './uploads';
const DATA_FOLDER = './data';

let dataFile = 'data.json';

const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');
console.log(DATA_FOLDER + '/' + dataFile, 'utf8')

const clothes = JSON.parse(dataString);

await shop.deleteClothes();
for(let clothe of clothes){
    await shop.addClothe(clothe);
}

await fs.rm(UPLOADS_FOLDER, { recursive: true, force: true });
await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
await fs.cp(DATA_FOLDER + '/images', UPLOADS_FOLDER, { recursive: true });

console.log('Demo data loaded');