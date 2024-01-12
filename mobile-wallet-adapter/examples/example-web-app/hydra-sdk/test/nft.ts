/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComputeBudgetProgram, Connection, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';

import {
  FanoutClient,
  MembershipModel,
} from '../src'
import fs from 'fs'
import { keypairIdentity, Metaplex, PublicKey } from '@metaplex-foundation/js';
import { Wallet } from '@project-serum/anchor';
let nfts: [{earliest: number, id: String}] = JSON.parse(fs.readFileSync('test/nfts.json').toString())
  const connection = new Connection(process.env.ANCHOR_PROVIDER_URL as string, 'confirmed');
  let authorityWallet: Keypair = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
       fs.readFileSync( process.env.ANCHOR_WALLET as string ).toString(),
      ),
    ),
  );
  let totalShares = 0
  for (var nft of ["DTrMWcdBCvgorNH15KLJTzxCaJc8yXHaTK51Cb4Nc45S"]){
    totalShares+= 1
  }
  // shuffle nfts
  console.log(nfts[0])
   nfts = nfts.sort(() => Math.random() - 0.5);
   console.log(nfts[0])
  console.log(totalShares)
  let fanoutSdk: FanoutClient;
  // @ts-ignore
    fanoutSdk = new FanoutClient(connection, new Wallet(authorityWallet));
    async function createFanout() {
   /*     const {fanout, nativeAccount} = await fanoutSdk.initializeFanout({
          totalShares,
          name: `Saga Genesis Hydra`,
          membershipModel: MembershipModel.NFT,
          defaultWeight: 138,

        });
        console.log(fanout.toBase58())
        console.log(nativeAccount.toBase58())  */
        let signers: any[] = []
        let newmembers: any = []
        let ixs: any = [ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 666420})]
          
          let members = await fanoutSdk.getMembers({
            fanout: new PublicKey("B9hxAEdMbVWCNL1jnK2P6rcZAo29qtFqFWPQNcizmoUK"),
          })
        for (var i in ["DTrMWcdBCvgorNH15KLJTzxCaJc8yXHaTK51Cb4Nc45S"] ){
       let nft = new PublicKey("DTrMWcdBCvgorNH15KLJTzxCaJc8yXHaTK51Cb4Nc45S")
       // @ts-ignore
          let shares = 9968
          try {


let blarg = await fanoutSdk.addMemberNftInstructions({
    fanout: new PublicKey("B9hxAEdMbVWCNL1jnK2P6rcZAo29qtFqFWPQNcizmoUK"),
    shares,
    membershipKey: nft
      })  

          if (blarg.instructions.length == 0) {
        continue
      }

  ixs.push(
    ...blarg.instructions,
    )
    signers.push(...blarg.signers)
  }
 catch (err){
  console.log(err)
 }
        if (ixs.length > 0) {
          try {
         
          let tx = new Transaction().add(...ixs)
          tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
          tx.feePayer = authorityWallet.publicKey
          /// you may want to await this if your rpc isn't nice
          await fanoutSdk.throwingSend(
            tx.instructions,
            signers,
            authorityWallet.publicKey
           )
          } catch (err){
            console.log(i)
console.log(err)
          }
ixs = [ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 666420})]
  signers =   []

      }
    }
        try {
         
          console.log('sending batch')
          let tx = new Transaction().add(...ixs)
          tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash
          tx.feePayer = authorityWallet.publicKey
          fanoutSdk.throwingSend(
            tx.instructions,
            signers,
            authorityWallet.publicKey
           )
          } catch (err){
console.log(err)
          }
      }
      createFanout()