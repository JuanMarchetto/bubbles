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
  const player1 = new PublicKey("EjPpXXDykPawauyZHsBMtxGwG7K4iFmxdvB6ockM56ZN")
  const player2 = new PublicKey("CUtKCTar8gb5VYCDWbX5yFMVrhbnod9aCNf4cfhD2qPK")

  it("Is initialized!", async () => {
    const game = anchor.web3.Keypair.generate();

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
  });
});
