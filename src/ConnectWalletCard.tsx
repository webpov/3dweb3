import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { fetchSolBalance, getCurrentPrice, getUsdAccountList, processUsdBalance, shortWeb3Address, trySolAddress, tryWalletConnection, useBlockchainState } from './Web3Provider';
import { Connector } from '@web3-react/types';

interface Solana {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
}

declare global {
  interface Window {
    solana?: Solana;
  }
}

export const ConnectWalletCard = forwardRef(({
  callbackConnect, RPC_URL = "https://api.mainnet.solana.com",
  MY_TOKEN_ADDRESS = "8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf",
  MY_USD_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}:any, ref:any ) => {
  const { connector, hooks } = useWeb3React();
  const { useSelectedAccount, useSelectedIsActive, useSelectedIsActivating } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const {
    usdBal, s__usdBal,
    solPrice, s__solPrice,
    milBal, s__milBal,
    solBal, s__solBal,
    tokBal, s__tokBal,
    tokBalance, s__tokBalance,
    milBalance, s__milBalance,
    solAddress, s__solAddress,
  } = useBlockchainState()  

  async function getTokenBalanceSpl(connection:any, connectedWallet:any) {
    const accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
      mint: new PublicKey(MY_TOKEN_ADDRESS)
    });
    if (!accountsList.value[0]) { return }
    const walletSpecificAccoutn = accountsList.value[0].pubkey
    const accountBalance = await connection.getTokenAccountBalance(walletSpecificAccoutn)
    if (!accountBalance.value.uiAmount) throw new Error('No balance found');
    let actualVal = parseInt(accountBalance.value.uiAmount)
    const formatter = Intl.NumberFormat('en', {notation: 'compact'})
    let stringVal = "x"+formatter.format(actualVal)
    
    s__tokBal(stringVal)
    s__tokBalance(actualVal)
    const mil_accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
      mint: new PublicKey(MY_TOKEN_ADDRESS)
    });
    const mil_walletSpecificAccount = mil_accountsList.value[0] ? mil_accountsList.value[0]?.pubkey : null
    const mil_accountBalance = mil_walletSpecificAccount
      ? await connection.getTokenAccountBalance(mil_walletSpecificAccount) : {value:{uiAmount:0}}
    
    let mil_actualVal:any = parseInt(mil_accountBalance.value.uiAmount)
    let mil_stringVal:any = formatter.format(mil_actualVal)
    s__milBal(mil_stringVal)
    s__milBalance(mil_actualVal)
  }

  const setBalancesAndPrices = async (solBal:any, formatter:any, usdAmountUI:any) => {
    let solBalPercent:any = `${formatter.format(parseFloat(solBal) * 1000)} %`;
    s__solBal(solBalPercent);
    s__usdBal(usdAmountUI);

    const theSolPrice:any = await getCurrentPrice("SOLUSDT");
    s__solPrice(theSolPrice);
  };

  const getSolBalance = async (provider:any, publicKey:any) => {
    var phantom = await provider
    if (!!phantom) {
      const connection = new Connection(RPC_URL);
      let solBale:any = await fetchSolBalance(connection, publicKey, LAMPORTS_PER_SOL);

      let usdAccList = await getUsdAccountList(connection, publicKey, MY_USD_ADDRESS);
      if (usdAccList) {
        const { usdAmountUI, formatter } = await processUsdBalance(connection, usdAccList);
        if (usdAmountUI && formatter) {
          let solBal = (parseFloat(solBale) / 10).toFixed(3);
          await setBalancesAndPrices(solBal, formatter, usdAmountUI);
        }
      }

      await getTokenBalanceSpl(connection, publicKey);
    }
  };

  const handleToggleConnect = () => {
    tryWalletConnection(isActive, isActivating, connector, callbackConnect)
  }

  const trySolConnect = async () => {
    const solAd = await trySolAddress()
    if (!solAd) { return }
    s__solAddress(solAd.toString())
    getSolBalance(window.solana, solAd);
  }

  useEffect(() => { if (isActive) {
    trySolConnect()
  } }, [isActive])

  useImperativeHandle(ref, () => ({
    solAddress, solBal, tokBal, usdBal, milBalance, handleToggleConnect
  }))
  
  return (<>
    {solAddress && <>
      <details ref={ref} className='    bg-b-90  block ml-4  block flex tx-altfont-1  bord-r-25   tx-white '>
        <summary className='tx-xsm   tx-center flex-wrap  '>
          <div title={milBal}
           className='Q_sm_x tx-start  noverflow bord-r-10 pos-rel noborder  pointer bg-10  bord-r-10 px-2 py-1    flex gap-1 flex-justify-start w-80  '
          >
            <div className=' z-800   px-1 bord-r-10 tx-lg tx-shadow-5 '>
              <div className='Q_sm_x nowrap pr-2'>☀️{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</div>
            </div>
          </div>
          <div title={milBal}
            className='Q_xs    box-shadow-2-b bord-r-10 px-2 py-1 right-0   flex gap-1 flex-justify-between '
          >
            <div className='   px-1 bord-r-10 tx-md tx-shadow-5'>
              {solAddress ? solAddress.substr(0,2)+".."+solAddress.substr(solAddress.length-3,solAddress.length) : 'N/A'}</div>
          </div>
        </summary>
      
      <div className='px-2 py-2 '>
        {!!solPrice && <>
            <div className='w-100 tx-end'> <span className='opaci-50 tx-right '>sol: </span><span>{solPrice}</span></div>
        </>}
        <div>
          💎
          <span className='opaci-50 Q_sm_x'>EVM: </span>
          <span className='Q_sm_x'>{account ? shortWeb3Address(account) : 'N/A'}</span>
          <span className='Q_xs tx-md'>{account ? shortWeb3Address(account) : 'N/A'}</span>
        </div>
        <div className="flex w-100  flex-justify-between">
          <div className='flex-col gap-1 flex-justify-betwee ' title={usdBal}>
            <div className='flex pt-1 flex-align-start' title="💸">
            </div>
            <div className='tx-lg flex'> <div className='Q_sm_x'>💸</div> ${usdBal ? usdBal : 'N/A'} </div>
          </div>
          <div className='flex-col gap-1 flex-justify-betwee ' title={tokBalance}>
            <div className='flex pt-1 flex-align-start' title="🛜">
            </div>
            <div className='tx-lg flex'> <div className='Q_sm_x'>🛜</div> {tokBal ? tokBal : 'N/A'} </div>
          </div>
          <div className='flex-col gap-1 flex-justify-betwee '>
            <div className='flex pt-1 flex-align-start' title="📜"></div>
            <div className='tx-lg flex'> <div className='Q_sm_x'>📜</div> {solBal ? solBal : 'N/A'} </div>
          </div>
        </div>
        <hr className=' opaci-10' />
        <button className='bord-r-10 opaci-chov--50 border-white py-1 w-100' onClick={handleToggleConnect} disabled={false}>
          <div className='Q_sm_x'>{isActive ? "Disconnect" : "Connect"}</div>
          <div className='Q_xs'>{isActive ? "Disconnect" : "Connect"}</div>
        </button>
        <a href="https://fluxbeam.xyz/app/tokens/8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf" target="_blank"
          className='   pt-2 tx-altfont-5 opaci-chov--50 tx-white tx-shadow-5 block 4'
        > 
          <div className="Q_sm_x tx-sm px-8 ">SUPPORT</div>
          <div className="Q_xs tx-xs px-2">SUPPORT</div>
        </a>
      </div>
    </details>
  </>}
  {!isActive &&
    <button onClick={handleToggleConnect} disabled={false}
      className={`   bg-trans mt-2 bgtrans opaci-chov--50
        z-800 block pos-rel block flex 
        bord-r-10  noborder tx-lg `}
    >
      <div className=' ml-4 box-shadow-5-b bg-white bord-r-15 py-2 tx-altfont-1'>
        <div className='Q_sm_x px-4 '>{isActive ? "Disconnect" : "Connect"}</div>
        <div className='Q_xs px-1 tx-sm'>{isActive ? "Disconnect" : "Connect"}</div>
      </div>
    </button>
    }
  </>)
})

ConnectWalletCard.displayName = "ConnectWalletCard"
export default ConnectWalletCard

