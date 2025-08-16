import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const codeDir = path.join(__dirname,'codes' );

if(!fs.existsSync(codeDir)){
    fs.mkdirSync(codeDir,{recursive : true});
}

export const generateFile = async (code,language) => {
    const jobId = uuid();
    const filePath = path.join(codeDir,`${jobId}.${language}`);
    fs.writeFile(filePath, code, 'utf8',()=>{}); 
    return filePath;
}

