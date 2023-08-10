const path = require("path");
const { generateIdl } = require("@metaplex-foundation/shank-js");

const idlDir = path.join(__dirname, "..", "idls");
const binaryInstallDir = path.join(__dirname, "..", ".crates");
const programDir = path.join(__dirname, "..", "programs");

generateIdl({
  generator: "anchor",
  programName: "example",
  programId: "DSg74Tu4w2urxxmw7gdTz4GZUE4DCy2C7RrPr3mRgmuB",
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "example", "program"),
});
