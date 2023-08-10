const path = require("path");
const { Solita } = require("@metaplex-foundation/solita");
const { writeFile } = require("fs/promises");

const PROGRAM_NAME = "network_program";
const PROGRAM_ID = "F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa";

const generatedIdlDir = path.join(__dirname, "idl");
const generatedSDKDir = path.join(__dirname, "src", "generated");

async function main() {
  console.error("Generating TypeScript SDK to %s", generatedSDKDir);
  const generatedIdlPath = path.join(generatedIdlDir, `${PROGRAM_NAME}.json`);

  const idl = require(generatedIdlPath);
  if (idl.metadata?.address == null) {
    idl.metadata = { ...idl.metadata, address: PROGRAM_ID };
    await writeFile(generatedIdlPath, JSON.stringify(idl, null, 2));
  }
  const gen = new Solita(idl, {
    formatCode: true,
    typeAliases: {
      usize: "u64",
    },
  });
  await gen.renderAndWriteTo(generatedSDKDir);

  console.error("Success!");

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
