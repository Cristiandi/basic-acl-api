import * as path from 'path';
import * as ncp from 'ncp';

const sourcePath = path.resolve(__dirname, '../common/templates/emails');
const destinationPath = path.resolve(__dirname, '../../dist/common/templates/emails');

ncp(sourcePath, destinationPath, { stopOnErr: true }, (err) => {
  if (err) return console.error(err);
});
