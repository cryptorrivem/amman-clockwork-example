import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../../src/generated";
import { THREAD_PROGRAM_ID } from "./constants";

export class PDA {
  static userStakedMint(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("user_staked_mint"), mint.toBuffer()],
      PROGRAM_ID
    );
  }

  static threadAuthority(mint: PublicKey) {
    return PublicKey.findProgramAddressSync([mint.toBuffer()], PROGRAM_ID);
  }

  static thread(authority: PublicKey, id: Buffer) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("thread"), authority.toBuffer(), id],
      THREAD_PROGRAM_ID
    );
  }
}
