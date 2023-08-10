// @ts-check
const path = require('path');
const programDir = path.join(__dirname, '..', '..', 'programs', 'example', 'program');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '..', '..', '.crates');

const idlHook = (idl) => {
  idl.instructions.map((ix) => {
    ix.defaultOptionalAccounts = true;
  });
  return idl;
};

module.exports = {
  idlGenerator: 'anchor',
  programName: 'example',
  programId: 'DSg74Tu4w2urxxmw7gdTz4GZUE4DCy2C7RrPr3mRgmuB',
  idlDir,
  idlHook,
  sdkDir,
  binaryInstallDir,
  programDir,
};
