import { AppBar, Stack, TextField, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';

import AccountInfo from '../components/AccountInfo';
import DisconnectButton from '../components/DisconnectButton';
import FundAccountButton from '../components/FundAccountButton';
import type { NextPage } from 'next';
import RecordMessageButton from '../components/RecordMessageButton';
import SignInButton from '../components/SignInButton';
import SignMessageButton from '../components/SignMessageButton';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { ToastProvider } from '../components/ToastProvider';
import { PublicKey } from '@solana/web3.js';
import { useFanoutData } from '../hooks/useFanoutData';

const Offset = styled('div')(
    // @ts-ignore
    ({ theme }) => theme.mixins.toolbar,
);

const ConnectButtonDynamic = dynamic(() => import('../components/ConnectButton'), { ssr: false });

const Home: NextPage = () => {
    const wallet = useWallet();
    const publicKey = new PublicKey("B9hxAEdMbVWCNL1jnK2P6rcZAo29qtFqFWPQNcizmoUK")
    const [memoText, setMemoText] = useState('');
    return (
        <>
        <ToastProvider>
           
            <Offset />
            {wallet.publicKey ? (
                <div>
                        <DisconnectButton color='inherit' variant='outlined' />
                        <AccountInfo mySelectedAccount={{
                            address: publicKey.toString(),
                            label: 'Saga Hydra',
                            publicKey,
                        }} /></div>
                    ) : (
                        <ConnectButtonDynamic color="inherit" variant="outlined">
                            Connect
                        </ConnectButtonDynamic>
                    )}
      </ToastProvider>
        </>
    );
};

export default Home;
