# Device did

## In the localnet

- First change the .env file, we need to the `ANCHOR_WALLET` to our local config wallet:
```
ANCHOR_WALLET="/home/yourWalletConfig/.config/solana/id.json"
```

- Second, run `solana-test-validator` in a new terminal:
```
solana-test-validator -r
```

- Third, `anchor deploy` our program which in the `solana_device_id` directory to the localnet.
```
anchor depoly
```

- Fourth, run `device-did-run.ts`
```
ts-node device-did-run.ts
```

## PoC for the next

we also made a PoC using `spl-token-2022` Token Extension in `poc-for-next` folder which will be our next iteration.
