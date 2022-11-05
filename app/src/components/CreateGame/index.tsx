import { FC, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import * as anchor from "@project-serum/anchor";

import { useProgram } from "./useProgram";

const endpoint = "http://localhost:8899";
const connection = new anchor.web3.Connection(endpoint);

export const CreateGame: FC = ({ }) => {
  const wallet: any = useAnchorWallet();

  const { program } = useProgram({ connection, wallet });
  return (
    <>
      <nav className="flex justify-between items-center px-16 py-4 bg-black">
        <WalletMultiButton />
      </nav>
      {!wallet ? (
        <p> no wallet </p>
      ) : (
        <p> wallet </p>
      )}
    </>
  );
};

