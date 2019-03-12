import moment from 'moment'
import { createWriteStream, existsSync, mkdirSync } from 'fs';


function log(operation = "", state = "") {
  let logPath = './lib/mLog'
  // const date = getFullDate();
  let date = moment().format('YYYYMMDD');
  const fileName = `${date}.morm.log`;
  const txt = `${state} --> ${operation}`;

  if (!existsSync(logPath)) {
      mkdirSync(logPath, { recursive: true });
  }
  let stock = logPath+'/'+fileName

  var stream = createWriteStream(stock, {flags:'a'});
  stream.write(txt + "\n");
  stream.end();
}

module.exports = { log };
