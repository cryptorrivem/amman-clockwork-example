AUTHORITY_KEYPAIR=keys/authority.json
solana-keygen new -o $AUTHORITY_KEYPAIR --no-bip39-passphrase --force
solana config set --keypair $AUTHORITY_KEYPAIR
solana config set --url http://127.0.0.1:8899

sleep 5

solana airdrop 100

MINT_KEYPAIR=keys/mint.json

solana airdrop 1
solana-keygen new -o $MINT_KEYPAIR --no-bip39-passphrase --force
MINT=$(solana address -k $MINT_KEYPAIR)
spl-token create-token $MINT_KEYPAIR
spl-token create-account $MINT
spl-token mint $MINT 100

WORKER_KEYPAIR=keys/worker.json
solana-keygen new -o $WORKER_KEYPAIR --no-bip39-passphrase --force
WORKER=$(solana address -k $WORKER_KEYPAIR)
solana airdrop 1 $WORKER

spl-token create-account --owner $WORKER --fee-payer $WORKER_KEYPAIR $MINT

WORKER_ID=0
clockwork initialize --mint $MINT
clockwork worker create $WORKER_KEYPAIR
clockwork delegation create -w $WORKER_ID
clockwork delegation deposit -a 1 -i 0 -w $WORKER_ID

ts-node ./clockwork-network.ts $AUTHORITY_KEYPAIR $MINT
