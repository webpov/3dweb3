import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { shortWeb3Address } from '../../../script/util/webhelp';
// import { callUpdateSupabase } from './callUpdateSupabase';

interface Solana {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
}

declare global {
  interface Window {
    solana?: Solana;
  }
}

export const getCurrentPrice = async (requestToken:string) => {
  let theToken = requestToken || "SOLUSDT";

  let url = `https://api.binance.com/api/v3/ticker/price?symbol=${theToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const currentPrice = parseFloat(data.price);
    return currentPrice;
  } catch (error) {
    console.log("FETCH FAILED");
    // You might want to handle the error here or return a default value
    return null;
  }
};
export const SolCard = forwardRef(({ name, callbackConnect}:any, ref:any ) => {
  const { connector, hooks } = useWeb3React();
  const { useSelectedAccount, useSelectedIsActive, useSelectedIsActivating } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const [usdBal, s__usdBal] = useState()
  const [solPrice, s__solPrice] = useState()
  const [milBal, s__milBal] = useState()
  const [solBal, s__solBal] = useState()
   const [tokBal, s__tokBal] = useState<any>()
   const [tokBalance, s__tokBalance] = useState<any>()
   const [milBalance, s__milBalance] = useState<any>()
   const [solAddress, s__solAddress] = useState("")
  const [error, setError] = useState<Error | undefined>(undefined)
  const [connectionLabel, setConnectionLabel] = useState('Disconnected')
  const trySolAddress = async () => {
    console.log("trySolAddress", trySolAddress)
    try {
      
      if (window.solana) {
        let ggg = window.solana.connect();
        let gg22 = await ggg;
        let solAd = gg22.publicKey.toString();
        s__solAddress(solAd);
        setConnectionLabel("✅ " + shortAd(solAd));
    
        getSolBalance(window.solana, gg22.publicKey);
      } else {
        console.error('Solana object is not available on window');
      }
    } catch (error) {
      alert("Wallet not found")
      
    }
  };
  
  useImperativeHandle(ref, () => ({
    solAddress, solBal, tokBal, usdBal, milBalance, handleToggleConnect
  }))
  
  async function getTokenBalanceWeb3(connection:any, tokenAccount:any) {

    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (!info.value.uiAmount) throw new Error('No balance found');
    // console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
    return info.value.uiAmount;
}
const MY_TOKEN_ADDRESS:any  = '8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf'
const MY_USD_ADDRESS:any  = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const MY_TOKEN_ACCOUNT:any  = '6zDLHeA1jXLUqMpVvrxScuXEvCEXG2hwbaGKS87fLgN9'
const MIL_TOKEN_ADDRESS:any  = '8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf'
// const MIL_TOKEN_ADDRESS:any  = '5npdQmci19YYiJoCkfqZ35zJyaGsFcVQUeSvKXhxPi9P '

async function getTokenBalanceSpl(connection:any, connectedWallet:any) {
  console.log("connectedWallet MY_TOKEN_ADDRESS", connectedWallet, "qqqqqq", MY_TOKEN_ADDRESS, "qqqqqqkkk")
  const accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    mint: new PublicKey(MY_TOKEN_ADDRESS)
  });
  
  console.log("accountsListaccountsList", accountsList)
  if (!accountsList.value[0]) { return }
  const walletSpecificAccoutn = accountsList.value[0].pubkey
  const accountBalance = await connection.getTokenAccountBalance(walletSpecificAccoutn)
  console.log("accountBalance", new PublicKey(MIL_TOKEN_ADDRESS))
  if (!accountBalance.value.uiAmount) throw new Error('No balance found');

  let actualVal = parseInt(accountBalance.value.uiAmount)
  const formatter = Intl.NumberFormat('en', {notation: 'compact'})
  let stringVal = "x"+formatter.format(actualVal)
  
  s__tokBal(stringVal)
  s__tokBalance(actualVal)
  console.log("logggg", new PublicKey(MIL_TOKEN_ADDRESS))
  const mil_accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    // mint: MIL_TOKEN_ADDRESS
    mint: new PublicKey(MIL_TOKEN_ADDRESS)
    // mint: new PublicKey(MY_TOKEN_ADDRESS)
  });
  const mil_walletSpecificAccoutn = mil_accountsList.value[0] ? mil_accountsList.value[0]?.pubkey : null
  const mil_accountBalance = mil_walletSpecificAccoutn ? await connection.getTokenAccountBalance(mil_walletSpecificAccoutn) : {value:{uiAmount:0}}
  let mil_actualVal:any = parseInt(mil_accountBalance.value.uiAmount)
  let mil_stringVal:any = formatter.format(mil_actualVal)
  
  s__milBal(mil_stringVal)
  s__milBalance(mil_actualVal)
  // callUpdateSupabase(connectedWallet.toString(),actualVal)
}
const getSolBalance = async (provider:any, publicKey:any) => {
  var phantom = await provider;
  if (phantom !== false) {
    // const devConnection = new Connection("https://api.devnet.solana.com");
    const connection123 = new Connection("https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r");
    (async () => {
      let balance = await connection123.getBalance(publicKey);
      let solBale:any = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(4))

      let usdAccList:any = null
      try {
        usdAccList = await connection123.getTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(MY_USD_ADDRESS)
        });
      } catch (error) {
      }
      // console.log("usdAccList?.value?.length", usdAccList?.value.length)
      if (!!usdAccList?.value?.length) {
        const usdwalletSpecificAccoutn = usdAccList.value[0].pubkey
        const usdBalance:any = await connection123.getTokenAccountBalance(usdwalletSpecificAccoutn)
        console.log("usdBalance", usdBalance.value.uiAmount)
        const formatter = Intl.NumberFormat('en', {notation: 'compact'})
        const usdAmount:any = parseFloat(usdBalance.value.uiAmount).toFixed(2)
        const usdAmountUI:any = formatter.format(usdAmount)
        let solBal:any = (parseFloat(solBale)/10).toFixed(3) // (parseFloat(`${usdAmount}`)/100) * 
        // console.log( "parseFloat(`${usdAmount}`) , parseFloat(solBale)")
        // console.log( parseFloat(`${usdAmount}`) , parseFloat(solBale))
        let solBalpercent:any = `${formatter.format(parseFloat(solBal)*100)} %`
        s__solBal(solBalpercent)
        s__usdBal(usdAmountUI)

        const theSolPrice:any = await getCurrentPrice("SOLUSDT")
        console.log("theSolPrice", theSolPrice)
        s__solPrice(theSolPrice)
      }


        // console.log("getTokenBalanceSpl", connection123, publicKey)
        await getTokenBalanceSpl(connection123, publicKey)
    })();
  }
  }
  const handleToggleConnect = async () => {
          console.log("isActive", isActive)
    setError(undefined) 
    if (isActive) {
        try {
          if(connector?.deactivate) { void connector.deactivate()
          } else { void connector.resetState() }
        } catch (error) {
          console.log("error phantom")
        }
      }
    else if (!isActivating) {
          setConnectionLabel('Connecting..')
          try {
            
        await connector.activate(1)
        callbackConnect()
      } catch (error:any) {
        connector.resetState()
        setError(error)
        alert("Wallet not found")
        
      }
      }
  }
  useEffect(() => {
    // handleToggleConnect()
  }
  ,[])
  useEffect(() => {
    if(isActive) {
      setConnectionLabel('🏦')
      trySolAddress()
    } else {
      setConnectionLabel('Wallet')
    }
  }
  ,[isActive])
  
  return (<>
        {solAddress && <>
    <details ref={ref} 
      className='    bg-b-90  block ml-4  block flex tx-altfont-1  bord-r-25   tx-white '
    >
        
        {/* <div className='opaci-chov--50  py-2 px-2'>
          Error: {(error?.message) ? ( error.message) : connectionLabel}
        </div> */}
        <summary className='tx-xsm   tx-center flex-wrap  '>
          <div className='Q_sm_x tx-start  noverflow bord-r-10 pos-rel noborder  pointer bg-10  bord-r-10 px-2 py-1    flex gap-1 flex-justify-start w-80  ' title={milBal}
          >
            <div className=' z-800   px-1 bord-r-10 tx-lg tx-shadow-5 '>
              <div className='Q_sm_x nowrap pr-2'>☀️{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</div>
            </div>
          </div>
          <div className='Q_xs    box-shadow-2-b bord-r-10 px-2 py-1 right-0   flex gap-1 flex-justify-between flex-aligin-center' title={milBal}
            // style={{background: "linear-gradient(45deg, #ffffff88, #ffffff11"}}
          >
            <div className='   px-1 bord-r-10 tx-md tx-shadow-5'>
              {solAddress ? solAddress.substr(0,2)+".."+solAddress.substr(solAddress.length-3,solAddress.length) : 'N/A'}</div>
          </div>
        </summary>
      
      <div className='px-2 py-2 '>
        {/* <hr className=' opaci-10' /> */}
        {/* <div>
          ☀️
          <span className='opaci-50 Q_sm_x'>SOL: </span>
          <span className='Q_sm_x'>{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</span>
          <span className='Q_xs tx-md'>{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</span>
        </div> */}
        {!!solPrice && <>
            <div className='w-100 tx-end'> <span className='opaci-50 tx-right '>sol: </span><span>{solPrice}</span></div>
        </>}
        <div>
          💎
          <span className='opaci-50 Q_sm_x'>EVM: </span>
          <span className='Q_sm_x'>{account ? shortWeb3Address(account) : 'N/A'}</span>
          <span className='Q_xs tx-md'>{account ? shortWeb3Address(account) : 'N/A'}</span>
        </div>
        {/* <hr className=' opaci-10' /> */}
        {/* <div className='Q_sm_x tx-center w-100 opaci-30 tx-bold-6'>Extra </div> */}
        <div className="flex w-100  flex-justify-between">
          <div className='flex-col gap-1 flex-justify-betwee flex-aligin-center' title={usdBal}>
            <div className='flex pt-1 flex-align-start' title="💸">
              {/* <div>💸</div> */}
              {/* <div className='Q_md_x opaci-50'>USDc: </div> */}
            </div>
            <div className='tx-lg flex'>
              <div className='Q_sm_x'>💸</div>
              ${usdBal ? usdBal : 'N/A'}
            </div>
          </div>
          <div className='flex-col gap-1 flex-justify-betwee flex-aligin-center' title={tokBalance}>
            <div className='flex pt-1 flex-align-start' title="🛜">
              {/* <div>🛜</div> */}
              {/* <div className='Q_md_x opaci-50'>Wifi: </div> */}
            </div>
            <div className='tx-lg flex'>
              <div className='Q_sm_x'>🛜</div>
              {tokBal ? tokBal : 'N/A'}
            </div>
          </div>
          <div className='flex-col gap-1 flex-justify-betwee flex-aligin-center'>
            <div className='flex pt-1 flex-align-start' title="📜">
            {/* <div>📜</div> */}
              {/* <div className='Q_md_x opaci-50'>Power: </div> */}
            </div>
            <div className='tx-lg flex'>
              <div className='Q_sm_x'>📜</div>
              {solBal ? solBal : 'N/A'}
            </div>
          </div>
          </div>
        <hr className=' opaci-10' />
        {
          <button className='bord-r-10 opaci-chov--50 border-white py-1 w-100' onClick={handleToggleConnect} disabled={false}>
            <div className='Q_sm_x'>{isActive ? "Disconnect" : "Connect"}</div>
            <div className='Q_xs'>{isActive ? "Disconnect" : "Connect"}</div>
          </button>
        }
        <a href="https://fluxbeam.xyz/app/tokens/8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf" target="_blank"
      className='   pt-2 tx-altfont-5 opaci-chov--50 tx-white tx-shadow-5 block 4'> 
        <div className="Q_sm_x tx-sm px-8 ">SUPPORT</div>
        <div className="Q_xs tx-xs px-2">SUPPORT</div>
      </a>
      </div>
      
    </details>
    </>}
    {!isActive &&
  <button 
className={`   bg-trans mt-2 bgtrans opaci-chov--50

 z-800 block pos-rel block flex 
  bord-r-10  noborder tx-lg `}
onClick={handleToggleConnect} disabled={false}
>
          <div className=' ml-4 box-shadow-5-b bg-white bord-r-15 py-2 tx-altfont-1'>
            <div className='Q_sm_x px-4 '>{isActive ? "Disconnect" : "Connect"}</div>
            <div className='Q_xs px-1 tx-sm'>{isActive ? "Disconnect" : "Connect"}</div>
          </div>
        </button>
        }
  </>)
})
SolCard.displayName = "SolCard"
export default SolCard

export function shortAd(address:string)
{
  return address.substr(0,2)+"-"+address.substr(address.length-2,address.length)
}