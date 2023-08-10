import { ThreadProgramIdl } from "@clockwork-xyz/sdk";
import { PublicKey } from "@solana/web3.js";

export const COLLECTION_METADATA =
  "https://arweave.net/V1cFfj1Hl4edgdDMCRZiTm7FbRpbFQm8nyOYo9bCodw";

export const NFT_METADATA =
  "https://arweave.net/V1cFfj1Hl4edgdDMCRZiTm7FbRpbFQm8nyOYo9bCodw";

export const MPL_TOKEN_AUTH_RULES_PROGRAM_ID = new PublicKey(
  "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg"
);

export const RULE_SET = new PublicKey(
  "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9"
);

export const THREAD_PROGRAM_ID = new PublicKey(
  ThreadProgramIdl.metadata.address
);
