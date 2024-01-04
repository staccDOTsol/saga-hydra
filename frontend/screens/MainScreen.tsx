import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Divider, Portal, Text, TextInput} from 'react-native-paper';

import AccountInfo from '../components/AccountInfo';
import RecordMessageButton from '../components/RecordMessageButton';
import SignMessageButton from '../components/SignMessageButton';
import useAuthorization from '../utils/useAuthorization';
import SignInButton from '../components/SignInButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function MainScreen() {
  const {accounts, onChangeAccount, selectedAccount} = useAuthorization();
  const [memoText, setMemoText] = useState('');
  return (
    <>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="Hydra dApp" />
      </Appbar.Header>
      <Portal.Host>
        {selectedAccount && (
          <AccountInfo mySelectedAccount={selectedAccount}
          />
        )}
          <View style={styles.container}>
            <SignInButton mode="contained">
              Sign In
            </SignInButton>
          </View>
        
      </Portal.Host>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  shell: {
    height: '100%',
  },
  spacer: {
    marginVertical: 16,
    width: '100%',
  },
  textInput: {
    width: '100%',
  },
});
