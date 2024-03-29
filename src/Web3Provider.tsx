"use client";
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { initializeConnector } from '@web3-react/core'
import { Web3ReactStore } from '@web3-react/types'
import { Phantom } from 'web3-react-phantom'
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
const phantom = initializeConnector<Phantom>((actions) => new Phantom({ actions }))
export const web3connectors: [Connector, Web3ReactHooks, Web3ReactStore][] = [phantom]
const connections: [Connector, Web3ReactHooks][] = web3connectors.map(([connector, hooks]) => [connector, hooks])
export const Web3Provider = ({children}:any) => {
    return (<>
      <Web3ReactProvider connectors={connections}>
        {children}
      </Web3ReactProvider>
    </>)
}
export function shortAd(address:string) {
  return address.substr(0,2)+"-"+address.substr(address.length-2,address.length)
}
export function shortWeb3Address(address:string) {
  return address.substr(0,5)+"..."+address.substr(address.length-3,address.length)
}
export const getCurrentPrice = async (requestToken:string) => {
  let url = `https://api.binance.com/api/v3/ticker/price?symbol=${requestToken || "SOLUSDT"}`;
  try {
    const response = await fetch(url);
    return parseFloat((await response.json()).price)
  } catch (error) { return 1 }
};
export const useBlockchainState = () => {
  const [usdBal, s__usdBal] = useState()
  const [solPrice, s__solPrice] = useState()
  const [milBal, s__milBal] = useState()
  const [solBal, s__solBal] = useState()
  const [tokBal, s__tokBal] = useState<any>()
  const [tokBalance, s__tokBalance] = useState<any>()
  const [milBalance, s__milBalance] = useState<any>()
  const [solAddress, s__solAddress] = useState("")  
  return {
    usdBal, s__usdBal,
    solPrice, s__solPrice,
    milBal, s__milBal,
    solBal, s__solBal,
    tokBal, s__tokBal,
    tokBalance, s__tokBalance,
    milBalance, s__milBalance,
    solAddress, s__solAddress,
  }
}
export const trySolAddress = async () => {
  if (!window?.solana) { return console.error('Solana object is not available on window') }
  try {
    let ggg = window.solana.connect();
    let gg22 = await ggg;
    return gg22.publicKey
  } catch (error) {
    alert("Web3 Wallet not found!")
    return null
  }
};
export const tryWalletConnection = async (isActive:boolean, isActivating:boolean, connector:any, callbackConnect:any) => {
  if (isActive) {
    try {
      if (connector?.deactivate) { void connector.deactivate() }
      else { void connector.resetState() }
    } catch (error) {
      console.log("Phantom wallet error!")
    }
  }
  else if (!isActivating) {
    try { await connector.activate(1); callbackConnect() }
    catch (error: any) { connector.resetState(); alert("Wallet not found") }
  }
}
export const fetchSolBalance = async (connection:any, publicKey:any, LAMPORTSPERSOL:any) => {
  let balance = await connection.getBalance(publicKey);
  return parseFloat((balance / LAMPORTSPERSOL).toFixed(4));
};
export const processUsdBalance = async (connection:any, usdAccList:any) => {
  if (!!usdAccList?.value?.length) {
    const usdwalletSpecificAccount = usdAccList.value[0].pubkey;
    const usdBalance = await connection.getTokenAccountBalance(usdwalletSpecificAccount);
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    const usdAmount:any = parseFloat(usdBalance.value.uiAmount).toFixed(2);
    const usdAmountUI = formatter.format(usdAmount);
    return { usdAmountUI, formatter };
  }
  return { usdAmountUI: null, formatter: null };
};
export const getUsdAccountList = async (connection:any, publicKey:any, MYUSDADDRESS:any) => {
  try {
    return await connection.getTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(MYUSDADDRESS),
    });
  } catch (error) {
    return null;
  }
};
