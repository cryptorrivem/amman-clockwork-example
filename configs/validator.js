const path = require("path");

const programDir = path.join(__dirname, "..", "programs");

function getProgram(programName) {
  return path.join(programDir, ".bin", programName);
}

module.exports = {
  validator: {
    commitment: "processed",
    accountsCluster: "https://api.devnet.solana.com",
    programs: [
      {
        label: "Example",
        programId: "DSg74Tu4w2urxxmw7gdTz4GZUE4DCy2C7RrPr3mRgmuB",
        deployPath: getProgram("example.so"),
      },
      {
        label: "Token Metadata",
        programId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        deployPath: getProgram("mpl_token_metadata.so"),
      },
      {
        label: "Token Auth Rules",
        programId: "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg",
        deployPath: getProgram("mpl_token_auth_rules.so"),
      },
      {
        label: "Clockwork Network",
        programId: "F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa",
        deployPath: getProgram("clockwork_network_program.so"),
      },
      {
        label: "Clockwork Thread",
        programId: "CLoCKyJ6DXBJqqu2VWx9RLbgnwwR6BMHHuyasVmfMzBh",
        deployPath: getProgram("clockwork_thread_program.so"),
      },
    ],
    accounts: [
      {
        label: "Metaplex Default RuleSet",
        accountId: "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9",
        executable: false,
      },
    ],
    geyserPluginConfigs: [
      path.resolve(__dirname, "../clockwork/geyser-plugin.config.json"),
    ],
  },
};
