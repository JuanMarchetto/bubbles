import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Bubbles } from "../target/types/bubbles";
import * as web3 from "@solana/web3.js"
import { PublicKey } from "@solana/web3.js"

describe("bubbles", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Bubbles as Program<Bubbles>;
  const payer = (program.provider as anchor.AnchorProvider).wallet;
  const player1 = new PublicKey("GgZqidq5shJkSZmejx92RTMz2Ti82VxXRdxtKjFKLntC")
  const player2 = new PublicKey("GgZqidq5shJkSZmejx92RTMz2Ti82VxXRdxtKjFKLntC")
  const game = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const tx = await program.methods.createGame(
      [player1, player2],
      5,
      10,
      5
    ).accounts({
      game: game.publicKey,
      payer: payer.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
      .signers([game])
      .rpc();

    const gameAccount = await program.account.game.fetch(game.publicKey);
    console.log(gameAccount);
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http://localhost:8899`);
  });

  it("can move", async () => {

    const tx = await program.methods.applyMove(
      0,
      1
    ).accounts({
      game: game.publicKey,
      payer: payer.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
      .rpc();

    const gameAccount = await program.account.game.fetch(game.publicKey);
    console.log(gameAccount);
  });

  it("can restart", async () => {

    const tx = await program.methods.restart(
    ).accounts({
      game: game.publicKey,
      payer: payer.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
      .rpc();
      console.log(`https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http://localhost:8899`);

    const gameAccount = await program.account.game.fetch(game.publicKey);
    console.log(gameAccount);
  });
});
