import { FanoutClient } from '../hydra-sdk/src'
import { ComputeBudgetProgram, Connection, Keypair, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { Picker } from '@react-native-picker/picker';
import { Modal, TextInput, TouchableHighlight } from 'react-native';
import {
  getMintNaturalAmountFromDecimal,
  pubKeyUrl,
  shortPubKey,
  tryPublicKey,
} from '../common/utils'
import {  Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { FanoutData, useFanoutData } from '../hooks/useFanoutData'
import { useFanoutMembershipMintVouchers } from '../hooks/useFanoutMembershipMintVouchers'
import { useFanoutMembershipVouchers } from '../hooks/useFanoutMembershipVouchers'
import { FanoutMintData, useFanoutMints } from '../hooks/useFanoutMints'

import React from 'react';
import { ToastAndroid, TouchableOpacity, Button } from 'react-native'; // Import Modal and other necessary components

import {
  Linking,
  StyleSheet,
  View,
} from 'react-native';

import {Text} from 'react-native-paper';

import { useEffect, useState } from 'react'
import useAuthorization from '../utils/useAuthorization'
// @ts-ignore
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { useConnection } from '@solana/wallet-adapter-react'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { AnchorProvider } from '@coral-xyz/anchor';
let switchboardFunction = new PublicKey("BXHY1pQcaqkhBxdjqpBrrbtirXaCuRJdXLSdqnYtDgsw")
type Props = Readonly<{
  mySelectedAccount: { address: string;
    label?: string | undefined;
    publicKey: PublicKey};
}>;

const LAMPORTS_PER_AIRDROP = 100000000;

function AccountInfo({mySelectedAccount}: Props) {
console.log(mySelectedAccount)
  const {authorizeSession} = useAuthorization();
  const [mintId, setMintId] = useState<string>("So11111111111111111111111111111111111111112")
  

  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const mintit = (itemValue) => {
    console.log(itemValue)
    setMintId(itemValue)
    setSelectedFanoutMint(
      // @ts-ignore
      fanoutMints.data.find((mint) => mint.data.mint.toString() === itemValue)
    )
    console.log(selectedFanoutMint)

  }
  const fanoutData = useFanoutData(mySelectedAccount)
  console.log(fanoutData)
  const { connection } = useConnection()
  const [selectedFanoutMint, setSelectedFanoutMint] = useState<FanoutMintData|undefined>(
    mintId && fanoutMints.data
      ? fanoutMints.data.find((mint) => mint.data.mint.toString() === mintId)
      : undefined)

  const fanoutMembershipMintVouchers = useFanoutMembershipMintVouchers(mintId)
  const [voucherMapping, setVoucherMapping] = useState<{
    [key: string]: string
  }>({})

  useEffect(() => {
    const anchor = "2xtQ8P5LDavTWab6AS4qeDo5osZETYtFioKPVTVTy5Ff"
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) =>
        fanoutMint.config.symbol === anchor ||
        fanoutMint.id.toString() === anchor
    )
  }, [

  ])
  const renderItem = ({item, index}) => {
    
    return (
      <View>

<TouchableOpacity onPress={async () => {
    setItem(item);
    setModalVisible2(true);
}}>
        
        <View 
        style={itemStyles.pixelatedBorder}
        >
      
        <Text style={itemStyles.text}>{item.token_info? item.token_info.symbol : item.id}</Text>
            <Image 
            
                source={{ uri: item.content.links.image ? item.content.links.image : /* placeholder image */ 'https://via.placeholder.com/150' }}
                style={{ width: 130, height: 130 }}
            />
            {/* Add more item details here if necessary */}
        </View></TouchableOpacity>
        </View>
    );
};
const { width: screenWidth } = Dimensions.get('window');

const MyNfts = () => {
    return (
      <View
      >
        <Carousel
        visible={myNftsVisible}
          data={nfts2}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={300}
        /></View>
    );
}
const nftsVisible = () => {
  setMyNftsVisible(true);
}
const assetsVisible = () => {
  setMyAssetsVisible(true);
}
const [myNftsVisible, setMyNftsVisible] = useState(false);
const [myAssetsVisible, setMyAssetsVisible] = useState(false);


const MyAssets = () => {
  return (<View>
   
      <Carousel
      visible={myAssetsVisible}
        data={assets2}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={300}
      />
      </View>
  );
}
  const findMetadataAccount = (membershipKey: PublicKey) => {
    const md = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    return PublicKey.findProgramAddressSync([
      Buffer.from('metadata', 'utf8'),
      md.toBuffer(),
      membershipKey.toBuffer(),
  ], md);
  }

  const distributeShare = async (
    fanoutData: FanoutData,
    addAllMembers: boolean
  ) => {
    try {
      console.log(fanoutMints)
      console.log(mintId)
    let selectedFanoutMint 
    try {
      selectedFanoutMint = new PublicKey(mintId) 
    }
    catch (e){
      selectedFanoutMint = new PublicKey("So11111111111111111111111111111111111111112");
    }
      const signedTx = await transact(async wallet => {
        await authorizeSession(wallet);
        console.log(1)
        const fanoutSdk = new FanoutClient(connection, mySelectedAccount);

        console.log(selectedFanoutMint)
        console.log(123)
        let collection, membershipKey 
        // await 1000 ms 
        console.log(nfts2)
        for (const nft of nfts2){
          for (const group of nft.grouping){
            console.log(group)
            if (group.group_key == "collection" && group.group_value == "46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC"){
              membershipKey = new PublicKey(nft.id)
            }
          }
        }

        let distributeForMint = false; 
        let fanoutMint: undefined | PublicKey = undefined 
        if (selectedFanoutMint.toBase58() != "So11111111111111111111111111111111111111112"){
          distributeForMint = true;
          fanoutMint = selectedFanoutMint
        }
      console.log({
        distributeForMint: distributeForMint,
        fanoutMint: fanoutMint,
        member: new PublicKey(mySelectedAccount.publicKey),
        fanout: fanoutData.fanoutId,
        payer: new PublicKey(mySelectedAccount.publicKey),
        membershipKey,
        metadata: ( findMetadataAccount(membershipKey))[0]
      })
      let ixs = [
        ComputeBudgetProgram.setComputeUnitPrice(
          {
            microLamports: 1000,
          }
        )
      ]
          let {instructions,signers} = await fanoutSdk.distributeNftMemberInstructions({
            distributeForMint: distributeForMint,
            fanoutMint: fanoutMint,
            member: new PublicKey(mySelectedAccount.publicKey),
            fanout: fanoutData.fanoutId,
            payer: new PublicKey(mySelectedAccount.publicKey),
            membershipKey,
            metadata: ( findMetadataAccount(membershipKey))[0]
          })
          ixs.push(...instructions)
          ixs.map(i=>(console.log(...i.keys)))
          
          const latestBlockhash = await connection.getLatestBlockhash();

          
          const txMessage = new TransactionMessage({
            payerKey: new PublicKey(mySelectedAccount.publicKey),
            recentBlockhash: latestBlockhash.blockhash,
            instructions: ixs,
          }).compileToV0Message();
          const versionedTransaction = new VersionedTransaction(txMessage);
        
          // Request to sign the transaction
          let signedTxs = await wallet.signTransactions({
            transactions: [versionedTransaction],
          });
          
        return signedTxs[0];

         // await executeTransaction(connection, asWallet(wallet), transaction, {
          //  confirmOptions: { commitment: 'confirmed', maxRetries: 3 },
         //   signers: [],
         // })
      
      
    });
    const signature = await connection.sendRawTransaction(
      // @ts-ignore
      signedTx.serialize(),
      { maxRetries: 3, skipPreflight: true }
    )

    console.info('Tx sig:', signature)

    await connection.confirmTransaction(signature, 'confirmed')

    ToastAndroid.show('Claim successful!', ToastAndroid.SHORT)
    } catch (e) {
      console.log(e)
      ToastAndroid.show(e.message, ToastAndroid.SHORT)
    }
  }
  const [item, setItem] = useState<any>({})
  const [amt, setAmt] = useState<string>("")
  const [assets, setAssets] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [assets2, setAssets2] = useState<any[]>([]);
  const [nfts2, setNfts2] = useState<any[]>([]);
  const [tokenPrices, setTokenPrices] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const showModal = () => {
    console.log("show modal")
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleCancel2 = () => {
    setModalVisible2(false);
  }
  const handleOk2 = async () => {
    
    let amount = 1;
    if (item.token_info && item.token_info.decimals){
    amount = parseInt((parseFloat(amt) * 10 ** item.token_info.decimals).toString())
    }
    try {
      console.log(111111111)
      console.log(1111)
      console.log(amount)
    const signedTx = await transact(async (wallet) => {
      console.log(22222)

      let selectedAccount = await authorizeSession(wallet);
      console.log(33333)
    console.log(item)
    console.log(item.id)
    let ixs: TransactionInstruction[] = []
    let ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(item.id),
      new PublicKey("2xtQ8P5LDavTWab6AS4qeDo5osZETYtFioKPVTVTy5Ff"),
    
    )
    let maybe_account = await connection.getAccountInfo(ata)
    if (!maybe_account){
      ixs.push(Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(item.id),
        ata,
        new PublicKey("2xtQ8P5LDavTWab6AS4qeDo5osZETYtFioKPVTVTy5Ff"),
        selectedAccount.publicKey
      ))
    }
    let ix = await Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(item.id),
        selectedAccount.publicKey
      ),
      ata,
      selectedAccount.publicKey,
      [],
      amount
    )
    ixs.push(ix)
    console.log(...ixs)
    // if item.interface != FungibleToken
   

                     // Authorize the wallet session

 // Connect to an RPC endpoint and get the latest blockhash, to include in
 // the transaction.
 const latestBlockhash = await connection.getLatestBlockhash();
 console.log(latestBlockhash);
 // Construct the Versioned message and transaction.
 const txMessage = new TransactionMessage({
   payerKey: selectedAccount.publicKey,
   recentBlockhash: latestBlockhash.blockhash,
   instructions: ixs ,
 }).compileToV0Message();
 const versionedTransaction = new VersionedTransaction(txMessage);

 // Request to sign the transaction
 let signedTxs = await wallet.signTransactions({
   transactions: [versionedTransaction],
 });
 

 return signedTxs[0];
});

await connection.sendRawTransaction(signedTx.serialize());
// await executeTransaction(connection, wallet as Wallet, transaction, {})
ToastAndroid.show('SPL Tokens sent!', ToastAndroid.SHORT)

     } catch (e) {
       console.log(e)
       ToastAndroid.show(e.message, ToastAndroid.SHORT)
     }
   };
 
    const handleOk = async () => {
       console.log("User entered:", tokenAddress);
      try {
      const tokenPK = tryPublicKey(tokenAddress);
      if (!tokenPK) {
        throw 'Invalid SPL token address, please enter a valid address based on your network';
      }
      const signedTx = await transact(async (wallet) => {
        let selectedAccount = await authorizeSession(wallet);
        const fanoutSdk = new FanoutClient(
          connection,
          // @ts-ignore
          selectedAccount
        );
                        // Authorize the wallet session
  
    // Connect to an RPC endpoint and get the latest blockhash, to include in
    // the transaction.
    const latestBlockhash = await connection.getLatestBlockhash();
    console.log(latestBlockhash);
  let {instructions, signers} =  await fanoutSdk.initializeFanoutForMintInstructions({
    fanout: fanoutData.data?.fanoutId as PublicKey,
    mint: tokenPK
  })
  console.log(...instructions);
    // Construct the Versioned message and transaction.
    const txMessage = new TransactionMessage({
      payerKey: selectedAccount.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToV0Message();
    const versionedTransaction = new VersionedTransaction(txMessage);
  
    // Request to sign the transaction
    let signedTxs = await wallet.signTransactions({
      transactions: [versionedTransaction],
    });
    
  
    return signedTxs[0];
  });
  
  await connection.sendRawTransaction(signedTx.serialize());
  // await executeTransaction(connection, wallet as Wallet, transaction, {})
   ToastAndroid.show('SPL Token added!', ToastAndroid.SHORT)
  
        } catch (e) {
          console.log(e)
          ToastAndroid.show(`Error adding SPL Token: ${e}`, ToastAndroid.SHORT)
        }
      };
    
  // Function to fetch token prices from Jupiter Price API
  const fetchTokenPrices = async (tokenIds) => {
    try {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenIds.join(',')}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      const response = await fetch("https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'searchAssets',
          params: {
            ownerAddress: "2xtQ8P5LDavTWab6AS4qeDo5osZETYtFioKPVTVTy5Ff",
            page: 1,
            tokenType: "all"
          },
        }),
      });
      const { result } = await response.json();
      const nfts = result.items.filter(asset => asset.interface.indexOf("NFT") > -1);
    // the asset.content.links.image is a redirect from ipfs, arweave, or something else
    // we need to fetch the image and store it in the asset object
    // then we can display the image in the app
    // fetch the image
    nfts.forEach(async (nft) => {
        try {

            const imageResponse = await fetch(nft.content.links.image);
            const imageBlob = await imageResponse.blob();
            
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result;
                nft.content.links.image = base64data;
            }
            reader.readAsDataURL(imageBlob);
            
        } catch (error) {
          console.error('Fetch error:', error);
        }
      });
    setNfts(nfts);
      // nonNfts are result.items not in nfts 
    let nonNfts = result.items.filter(asset => asset.interface.indexOf("V") == -1 && asset.interface.indexOf("NFT") == -1);
    // remove instances of NFTS from nonNfts
      nonNfts = nonNfts.filter(asset => !nfts.find(nft => nft.id == asset.id));
    nonNfts.forEach(async (nft) => {
      try {
          
          if (nft.token_info.symbol == "USDC"){
              nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
          }
          else if (nft.token_info.symbol == "bSOL"){
            nft.content.links.image = "https://assets.coingecko.com/coins/images/26636/standard/blazesolana.png?1696525709"
          }
          else {
          const imageResponse = await fetch(nft.content.links.image);
          const imageBlob = await imageResponse.blob();
          
          const reader = new FileReader();
          reader.onloadend = function() {
              const base64data = reader.result;
              nft.content.links.image = base64data;
          }
          reader.readAsDataURL(imageBlob);
      }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    });
    // Fetch prices for the assets
    const prices = await fetchTokenPrices(result.items.map(asset => asset.id));

    // multiply out prices by asset.supply
      Object.keys(prices).forEach((key) => {
          try {
              if (nonNfts.find(asset => asset.id == key)){
              prices[key].price = prices[key].price * nonNfts.find(asset => asset.id == key).token_info.balance / 10 ** nonNfts.find(asset => asset.id == key).token_info.decimals;
              }
          } catch (error) {
              console.log(error);
          }
          });
      console.log(prices)

    setTokenPrices(prices);
    setAssets(nonNfts);
    };

    fetchAssets();
    
  }, []);

  useEffect(() => {
    const fetchAssets = async (publicKey) => {
      const response = await fetch("https://jarrett-solana-7ba9.mainnet.rpcpool.com/8d890735-edf2-4a75-af84-92f7c9e31718", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'searchAssets',
          params: {
            ownerAddress: publicKey,
            page: 1,
            tokenType: "all"
          },
        }),
      });
      const { result } = await response.json();
      const nfts = result.items.filter(asset => asset.interface.indexOf("NFT") != -1);
    // the asset.content.links.image is a redirect from ipfs, arweave, or something else
    // we need to fetch the image and store it in the asset object
    // then we can display the image in the app
    // fetch the image
    console.log(nfts)
    nfts.forEach(async (nft) => {
        try {

            const imageResponse = await fetch(nft.content.links.image);
            const imageBlob = await imageResponse.blob();
            
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result;
                nft.content.links.image = base64data;
            }
            reader.readAsDataURL(imageBlob);
            
        } catch (error) {
          console.error('Fetch error:', error);
        }
      });
      console.log(nfts)
    setNfts2(nfts);

    let nonNfts = result.items.filter(asset => asset.interface.indexOf("V") == -1&& asset.interface.indexOf("NFT") == -1);
    nonNfts = nonNfts.filter(asset => !nfts.find(nft => nft.id == asset.id));

    nonNfts.forEach(async (nft) => {
      try {
          
        if (nft.token_info.symbol == "USDC"){
          nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
      }
      else if (nft.token_info.symbol == "bSOL"){
        nft.content.links.image = "https://assets.coingecko.com/coins/images/26636/standard/blazesolana.png?1696525709"
      }
      else {
          const imageResponse = await fetch(nft.content.links.image);
          const imageBlob = await imageResponse.blob();
          
          const reader = new FileReader();
          reader.onloadend = function() {
              const base64data = reader.result;
              nft.content.links.image = base64data;
          }
          reader.readAsDataURL(imageBlob);
     
      }
      } catch (error) {
        console.error('Fetch error:', error);
        // not a crypto placeholder
        nft.content.links.image = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
      }
    });
    setAssets2(nonNfts);
    };
    fetchAssets(mySelectedAccount.publicKey);
  }, []);
  

// AsyncButton Component
const AsyncButton = ({ onPress, children, color }) => (
  <TouchableOpacity onPress={onPress} style={[styles.balanceRow, { backgroundColor: color }]}>
    <Text style={styles.balanceRow}>{children}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {fanoutData.error && (
          <View style={styles.container}>
            <Text style={styles.balanceRow}>Hydra Wallet not found</Text>
          </View>
        )}

<View style={styles.container}>
      <Text style={styles.balanceRow}>
        {fanoutData.data?.fanout.name ? (
          fanoutData.data?.fanout.name
        ) : (
          // Placeholder for loading state
          'Loading...'
        )}
      </Text>
      <View style={styles.container}>
      {myNftsVisible && (
      <MyNfts />
    )}
    {myAssetsVisible && (
      <MyAssets />
    )}
        <View>
          <Text style={styles.balanceRow}>
            Total Inflow:{' '}
            {selectedFanoutMint ? (
              `${Number(
                getMintNaturalAmountFromDecimal(
                  Number(selectedFanoutMint.data.totalInflow),
                  selectedFanoutMint.info.decimals
                )
              )} ${selectedFanoutMint.config.symbol}`
            ) : fanoutData.data?.fanout ? (
              `${parseInt(fanoutData.data?.fanout?.totalInflow.toString() ?? '0') / 1e9} ◎`
            ) : (
              // Placeholder for loading state
              'Loading...'
            )}
          </Text>
          <Text style={styles.balanceRow}>
            Balance:{' '}
            {selectedFanoutMint
              ? `${selectedFanoutMint.balance} ${selectedFanoutMint.config.symbol}`
              : `${fanoutData.data?.balance}◎`}
          </Text>
        </View>

        <View>
          <Picker
            selectedValue={mintId}
            onValueChange={(itemValue) => mintit(itemValue)}
            style={styles.balanceRow}
          >
            <Picker.Item label="SOL" value="default" key="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" />
            {fanoutMints.data && fanoutMints.data.map((asset) => (
              <Picker.Item label={asset.data.mint.toBase58()} value={asset.data.mint.toBase58()} key={asset.data.mint.toBase58()} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
    <View style={styles.container}>
      <Text style={styles.balanceRow}>
        Fanout Address:{' '}
        <Text
          style={styles.labelRow}
          onPress={() => Linking.openURL(pubKeyUrl(fanoutData.data?.fanoutId, "mainnet-beta"))}
        >
          {shortPubKey(fanoutData.data?.fanoutId.toString())}
        </Text>
      </Text>
      {selectedFanoutMint ? (
        <Text style={styles.balanceRow}>
          {selectedFanoutMint.config.symbol} Wallet Token Account:{' '}
          <Text
            style={styles.labelRow}
            onPress={() => Linking.openURL(pubKeyUrl(
              // @ts-ignore 
              selectedFanoutMint.data.tokenAccount,
              "mainnet-beta"
            ))}
          >
            {shortPubKey(selectedFanoutMint.data.tokenAccount)}
          </Text>
        </Text>
      ) : (
        <Text style={styles.balanceRow}>
          Sol Wallet Address:{' '}
          <Text
            style={styles.labelRow}
            onPress={() => Linking.openURL(pubKeyUrl(
              fanoutData.data?.nativeAccount,
              "mainnet-beta"
            ))}
          >
            {shortPubKey(fanoutData.data?.nativeAccount)}
          </Text>
        </Text>
      )}
      <Text style={styles.balanceRow}>
        Total Members: {fanoutData.data?.fanout?.totalMembers.toString()}
      </Text>
      <View style={styles.labelRow}>
        {!fanoutMembershipVouchers.data ? (
          // Placeholder for loading state
          <View style={styles.balanceRow}></View>
        ) : (
          fanoutMembershipVouchers.data?.map((voucher, i) => (
            <View
              key={voucher.pubkey.toString()}
              style={styles.balanceRow}
            >
              <Text style={styles.balanceRow}>
                {voucher.parsed.membershipKey.toString()}
                <Text style={styles.labelRow}>
                <View style={styles.container}>
                      {voucher.parsed.membershipKey.toString()}
                      <View style={styles.container}>
                        <>
                          {`(${voucher.parsed.shares.toString()} shares, `}
                          {selectedFanoutMint
                            ? fanoutMembershipMintVouchers.data &&
                              fanoutMembershipMintVouchers.data.length > 0
                              ? `${
                                  Number(
                                    getMintNaturalAmountFromDecimal(
                                      Number(
                                        fanoutMembershipMintVouchers.data.filter(
                                          (v) =>
                                            v.pubkey.toString() ===
                                            voucherMapping[
                                              voucher.pubkey.toString()
                                            ]
                                        )[0]?.parsed.lastInflow
                                      ),
                                      selectedFanoutMint.info.decimals
                                    )
                                  ) *
                                  (Number(voucher.parsed.shares) / 100)
                                } ${selectedFanoutMint.config.symbol} claimed)`
                              : `0 ${selectedFanoutMint.config.symbol} claimed)`
                            : `${
                                parseInt(
                                  voucher.parsed.totalInflow.toString()
                                ) / 1e9
                              }◎ claimed)`}
                        </>
                      </View>
                    </View>
                </Text>
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
    <View style={styles.container}>
      <Text style={styles.balanceRow}>
        Total Shares: {fanoutData.data?.fanout?.totalShares.toString()}
      </Text>
      <View style={styles.balanceRow}>
        <AsyncButton
          onPress={async () =>
            fanoutData.data && distributeShare(fanoutData.data, false)
          }
          color="rgb(96, 165, 250)"
        >
          Distribute To Self
        </AsyncButton>
    <View style={{marginTop: 22}}>
    <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible2}
  onRequestClose={handleCancel2}
>
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.modalView}>
      <Text style={modalStyles.modalText}>Enter {item.id} amount</Text>
      <Text style={modalStyles.modalText}>Enter the amount you would like to add to Saga Hydra - 1 for NFTs duh</Text>
      <TextInput 
        style={modalStyles.modalTextInput} 
        onChangeText={text => setAmt(text)} 
        value={amt} 
      />
      <View style={modalStyles.buttonContainer}>
        <TouchableHighlight
          style={modalStyles.button}
          onPress={handleCancel2}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={modalStyles.button}
          onPress={handleOk2}
        >
          <Text style={modalStyles.buttonText}>OK</Text>
        </TouchableHighlight>
      </View>
    </View>
  </View>
</Modal><Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={handleCancel}
>
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.modalView}>
      <Text style={modalStyles.modalText}>Enter SPL token address</Text>
      <Text style={modalStyles.modalText}>Enter the SPL token address you would like to add to Saga Hydra</Text>
      <TextInput 
        style={modalStyles.modalTextInput} 
        onChangeText={text => setTokenAddress(text)} 
        value={tokenAddress} 
      />
      <View style={modalStyles.buttonContainer}>
        <TouchableHighlight
          style={modalStyles.button}
          onPress={handleCancel}
        >
          <Text style={modalStyles.buttonText}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={modalStyles.button}
          onPress={handleOk}
        >
          <Text style={modalStyles.buttonText}>OK</Text>
        </TouchableHighlight>
      </View>
    </View>
  </View>
</Modal>
    </View>
        {fanoutData.data && (
          <View>
          <AsyncButton
            onPress={async () => showModal()}
            color="rgb(156, 163, 175)"
          >
            Add SPL Token
          </AsyncButton>
          <AsyncButton
            onPress={async () => {setMyAssetsVisible(false); nftsVisible()}}
            color="rgb(156, 163, 175)"
          >
            Sned NFTs
          </AsyncButton>
          <AsyncButton
            onPress={async () => {setMyNftsVisible(false); assetsVisible()}}
            color="rgb(156, 163, 175)"
          >
            Sned Assets
          </AsyncButton>

          </View>

        )}
      </View>
    </View>
</View>
</View>
)};
const itemStyles = StyleSheet.create({
  pixelatedBorder: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 150,
    width: 300,
    padding: 50,
    marginLeft: 2,
    marginRight: 2,
    borderStyle: 'dotted',
    borderWidth: 4,
    borderColor: '#FF00FF',
    shadowColor: '#00FFFF',
    // shadow 0 0 0 4px 
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
  const styles = StyleSheet.create({
    addressMenu: {
      end: 18,
      backgroundColor: '#0A0A0A', // Dark background
      borderColor: '#FFD700', // Gold border
      borderWidth: 2,
    },
    addressMenuItem: {
      maxWidth: '100%',
      color: '#00FF00', // Bright green text
    },
    addressMenuTrigger: {
      marginBottom: 12,
      backgroundColor: '#FF4500', // Retro orange button
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      backgroundColor: '#000080', // Navy background
    },
    labelIcon: {
      marginRight: 4,
      top: 4,
      tintColor: '#FFFFFF', // White icons
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      borderBottomColor: '#FF69B4', // Hot pink underline
      borderBottomWidth: 2,
    },
    container: {
      paddingVertical: 12,
      backgroundColor: '#800080', // Purple background
    },
    keyRow: {
      marginBottom: 12,
    },
  });
  
  
  const modalStyles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white', // Light background for the modal content
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTextInput: {
      width: 320,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      backgroundColor: '#fff', // White background for text input
      color: 'black', // Black text color
      padding: 10, // Padding for text input
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: 'black', // Black text color
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    button: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonText: {
      color: 'white',
    },
  });
  
  // Add CSS for the new element:
  
export default AccountInfo