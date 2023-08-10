import tape, { Test, TestCase } from "tape";
import { bignum, COption } from "@metaplex-foundation/beet";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Specification, Specifications } from "spok";
import { ConfirmedTransactionAssertablePromise } from "@metaplex-foundation/amman-client";

export function toNumber(a: bignum) {
  return new BN(a).toNumber();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Assert = {
  equal(actual: any, expected: any, msg?: string): void;
  deepEqual(actual: any, expected: any, msg?: string): void;
  ok(value: any, msg?: string): void;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function assertTx<
  T extends { tx: ConfirmedTransactionAssertablePromise }
>(t: Test, txPromise: Promise<T>) {
  const { tx, ...result } = await txPromise;
  await tx.assertSuccess(t);
  return result;
}

export function assertSamePubkey(
  t: Assert,
  a: PublicKey | COption<PublicKey>,
  b: PublicKey,
  message?: string
) {
  t.equal(a?.toBase58(), b.toBase58(), message);
}

export function assertSameBignum(
  t: Assert,
  a: bignum,
  b: bignum | number,
  message?: string
) {
  t.equal(new BN(a).toNumber(), new BN(b).toNumber(), message);
}

export function spokSamePubkey(
  a: PublicKey | COption<PublicKey>
): Specifications<PublicKey> {
  const same = (b: PublicKey | null | undefined) => b != null && !!a?.equals(b);

  same.$spec = `spokSamePubkey(${a?.toBase58()})`;
  same.$description = `${a?.toBase58()} equal`;
  return same;
}

export function spokSameBignum(a: BN | bignum): Specification<bignum> {
  const same = (b?: BN | bignum) => b != null && new BN(a).eq(new BN(b));

  same.$spec = `spokSameBignum(${a})`;
  same.$description = `${a} equal`;
  return same;
}

export function assertIsNotNull<T>(
  t: Test,
  x: T | null | undefined
): asserts x is T {
  t.ok(x, "should be non null");
}

declare module "tape" {
  interface Test {
    deepEqualExt(
      actual: any,
      expected: any,
      message: string,
      path?: string[]
    ): void;
  }
}

export function test(name: string, cb: TestCase) {
  tape(name, (test: Test) => {
    class TestError extends Error {
      constructor(
        readonly actual: any,
        readonly expected: any,
        readonly path: string[],
        message?: string
      ) {
        super(message);
      }
    }
    function check(
      actual: any,
      expected: any,
      message: string,
      path: string[]
    ) {
      if (actual !== expected) {
        throw new TestError(actual, expected, path, message);
      }
    }

    test.deepEqualExt = function deepEqual(
      actual: any,
      expected: any,
      message: string,
      path: string[] = []
    ) {
      try {
        if (actual instanceof PublicKey && expected instanceof PublicKey) {
          check(actual.toBase58(), expected.toBase58(), message, path);
        } else if (actual instanceof BN && expected instanceof BN) {
          check(actual.toString(), expected.toString(), message, path);
        } else if (Array.isArray(actual) && Array.isArray(expected)) {
          check(actual.length, expected.length, message, [...path, "length"]);
          actual.forEach((a, ix) =>
            this.deepEqualExt(a, expected[ix] as any, message, [
              ...path,
              ix.toString(),
            ])
          );
        } else if (typeof actual === "object" && typeof expected === "object") {
          const keys = Object.keys(actual);
          this.deepEqualExt(keys, Object.keys(expected), message, [
            ...path,
            "keys",
          ]);
          keys.forEach((k) =>
            this.deepEqualExt(actual[k], expected[k], message, [...path, k])
          );
        } else {
          check(actual, expected, message, path);
        }
        if (path.length === 0) {
          this.assert(true, message);
        }
      } catch (err: any) {
        if (path.length === 0 && err instanceof TestError) {
          this.equal(actual, expected, message + ": " + err.path.join("."));
        } else {
          throw err;
        }
      }
    };
    return cb(test);
  });
}
