import {Readable} from 'stream';

async function readableToString(readable) {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

const readable = Readable.from('Good morning!', {encoding: 'utf8'});
console.log(await readableToString(readable));