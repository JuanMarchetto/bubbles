import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { useProgram } from '../utils/useProgram';
import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: NextPage = (props) => {
  const endpoint = 'http://localhost:8899';
  const connection = new anchor.web3.Connection(endpoint);

  const wallet = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });

  const router = useRouter();
  const { slug } = router.query;
  const playerPublicKey = new PublicKey(slug);

  useEffect(() => {
    if (program) {
      (async () => {
        const [gamePublicKey] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from('game'), playerPublicKey.toBuffer() ?? Buffer.from('')],
          program.programId
        );
        const gameAccount = await program.account.game.fetch(gamePublicKey);
        console.log(gameAccount);
      })();
    }
  }, [program]);

  return (
    <>
      <p> {slug}</p>
      <WalletMultiButton />
    </>
  );
};

export default Home;
