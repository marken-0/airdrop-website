import React, { useState } from "react";
import { ChakraProvider, Box, Text, VStack, Grid, theme, Input, Button } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const handleAirdrop = async () => {
    const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'));
    const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL; // 1 SOL 

    try {
      console.log(`Requesting airdrop for ${walletAddress}`)
      const signature = await SOLANA_CONNECTION.requestAirdrop(
          new PublicKey(walletAddress),
          AIRDROP_AMOUNT
      );
      const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash();
      await SOLANA_CONNECTION.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature
      },'finalized');
      setTransactionStatus(`Airdrop Successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
      console.error(error);
      setTransactionStatus('Error requesting airdrop, please try again');
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Text>Enter your Solana wallet address:</Text>
            <Input placeholder="Wallet Address" value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} />
            <Button onClick={handleAirdrop}>Request Airdrop</Button>
            {transactionStatus && <Text>{transactionStatus}</Text>}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
