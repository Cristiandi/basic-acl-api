import * as path from 'path';
import * as ncp from 'ncp';

const emailsSourcePath = path.resolve(__dirname, '../common/templates/emails');
const emailsDestinationPath = path.resolve(__dirname, '../../dist/common/templates/emails');

ncp(emailsSourcePath, emailsDestinationPath, { stopOnErr: true }, (err) => {
  if (err) return console.error(err);
});
