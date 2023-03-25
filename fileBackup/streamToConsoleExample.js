import * as fs from 'fs';

async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
  }
}

const readable = fs.createReadStream(
  './fileBackup/test.txt', {encoding: 'utf8'});
logChunks(readable);