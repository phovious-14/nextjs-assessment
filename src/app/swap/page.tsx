"use client"

import Chains from "@/components/chains"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from "next/image";
import Tokens from "@/components/tokens";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";
import { CircularProgress } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import dynamic from 'next/dynamic'

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
})

export default function Page() {

  const { address } = useAccount()
  const router = useRouter()
  const { setData }:any = useData()
  const [isChainVisible1, setChainVisible1] = useState(false)

  const [isTokenVisible1, setTokenVisible1] = useState(false)
  const [isTokenVisible2, setTokenVisible2] = useState(false)

  const [fromChain, setFromChain] = useState<any>(null)

  const [fromToken, setFromToken] = useState<any>(null)
  const [toToken, setToToken] = useState<any>(null)

  const [fromTokenAddress, setFromTokenAddress] = useState<string>('')
  const [toTokenAddress, setToTokenAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('0.00')
  const [route, setRoute] = useState<any>(null)
  const [loadRoute, setLoadRoute] = useState(false)
  const [loadRouteTran, setLoadRouteTran] = useState(false)
  
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<any>({});

  const API_KEY = "59048949-5033-4639-b626-6583d8ac3c98"

  const getQuote = async () => {

    if(!address){
      setOpen(true)
      setMsg({messege:'Connect Wallet', type:"error"})
      return
    }

    const uniqueRoutesPerBridge = true; // Returns the best route for a given DEX / bridge combination
    const sort = "output"; // "output" | "gas" | "time"
    const singleTxOnly = true;

    try {
      setLoadRoute(true)
      const response1 = await fetch(
        `https://api.socket.tech/v2/quote?fromChainId=${fromChain?.chain?.chainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${fromChain?.chain?.chainId}&toTokenAddress=${toTokenAddress}&fromAmount=${Number(amount) * Math.pow(10, fromToken?.token?.decimals)}&userAddress=${address}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&singleTxOnly=${singleTxOnly}`,
        {
          method: "GET",
          headers: {
            "API-KEY": API_KEY,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const json1 = await response1.json();
      console.log(json1.result.routes[0]);

      setRoute(json1.result.routes[0])
      setLoadRoute(false)

    } catch (e) {

      console.log(e);
      setLoadRoute(false)

    }
  }

  const getRouteTransaction = async () => {
    //get route transaction data
    try {
      setLoadRouteTran(true)
      const response2 = await fetch("https://api.socket.tech/v2/build-tx", {
        method: "POST",
        headers: {
          "API-KEY": API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ route }),
      });
      const json2 = await response2.json();
      setData({
        chain: fromChain.chain,
        route,
        routerTransactionData: json2.result
      })
      setLoadRouteTran(false)
      if(json2.result!=undefined) router.push(`/swap/price`)
    } catch (e) {
      setOpen(true)
      setMsg({messege:'Route Transaction Failed', type:'error'})
      console.log(e);
      setLoadRouteTran(false)
    }

  }  

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setFromToken(false)
    setToToken(false)
  }, [fromChain])

  useEffect(() => {
    (fromChain != null && fromTokenAddress != null && toTokenAddress != null) &&
      setTimeout(getQuote, 1000)
  }, [amount])

  useEffect(() => {
    setFromTokenAddress(fromToken?.token?.address)
    setToTokenAddress(toToken?.token?.address)
  }, [toToken])

  return <div className="bg-slate-950 overflow-hidden">
  <Header />
  <div className="bg-slate-950 h-screen w-screen flex justify-center items-center flex-row overflow-hidden">

    <div className="w-[450px] bg-slate-900 rounded-2xl flex justify-start items-center flex-col p-4 overflow-hidden">

      {!isChainVisible1 && !isTokenVisible1 && !isTokenVisible2 ?
        <>
          <h1 className="w-full text-left text-slate-300 text-xl">Transfer</h1>

          <div className="flex justify-start items-center flex-col w-full bg-slate-800 mt-4 rounded-md relative">
            <div className="flex justify-between items-center flex-row w-full p-2">
              <div className="flex justify-start items-center">
                <h1 className="text-slate-400">From</h1>
                {

                  fromChain?.chain?.icon && <div className="ml-2 flex justify-start items-center flex-row ">
                    <Image src={fromChain?.chain?.icon} alt="" width={22} height={22} className="rounded-full ml-1" />
                    <h1 className="text-slate-300 ml-1">{fromChain?.chain?.name}</h1>
                  </div>
                }
                <button onClick={() => {
                  setChainVisible1(true)
                  setTokenVisible1(false)
                  setTokenVisible2(false)
                }}><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>
              </div>
            </div>

            <div className="flex justify-between items-center flex-row w-full p-2">
              <input className="text-slate-400 font-bold text-xl bg-slate-800 outline-none w-1/2" placeholder={'0.00'} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <div className="flex justify-center items-center flex-row">
                {
                  fromToken?.token != undefined && <div className="ml-2 flex justify-start items-center flex-row bg-slate-700 p-1 rounded-full px-2">
                    <Image src={fromToken?.token?.logoURI} alt="" width={22} height={22} className="rounded-full" />
                    <h1 className="text-slate-300 ml-1">{fromToken?.token?.symbol}</h1>
                  </div>
                }
                {fromChain ? <button onClick={() => {
                  setChainVisible1(false)
                  setTokenVisible1(true)
                  setTokenVisible2(false)
                }}><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>
                  : <button disabled title="Select chain"><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>
                }
              </div>
            </div>
          </div>

        </>
        :
        <>
          {isTokenVisible1 && <Tokens fromChainId={fromChain.chain?.chainId} setToken={setFromToken} setVisible={setTokenVisible1} />}
          {isChainVisible1 && <Chains setChain={setFromChain} setVisible={setChainVisible1} />}
        </>
      }

      {!isChainVisible1 && !isTokenVisible1 && !isTokenVisible2 ?
        <>
          <div className="flex justify-start items-center flex-col w-full bg-slate-800 mt-4 rounded-md relative">
            <div className="flex justify-between items-center flex-row w-full p-2">
              <div className="flex justify-start items-center">
                <h1 className="text-slate-400">To</h1>
                {

                  fromChain?.chain?.icon && <div className="ml-2 flex justify-start items-center flex-row ">
                    <Image src={fromChain?.chain?.icon} alt="" width={22} height={22} className="rounded-full" />
                    <h1 className="text-slate-300 ml-1">{fromChain?.chain?.name}</h1>
                  </div>
                }
                <button onClick={() => {
                  setChainVisible1(true)
                  setTokenVisible1(false)
                  setTokenVisible2(false)
                }}><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>

              </div>
            </div>


            <div className="flex justify-between items-center flex-row w-full p-2">
              {route != null ? <h1 className="text-slate-400 font-bold text-xl bg-slate-800 outline-none w-1/2">{(route?.userTxs[0]?.toAmount / Math.pow(10, route.userTxs[0].toAsset.decimals)).toFixed(4)}</h1>
                : <h1 className="text-slate-400 font-bold text-xl bg-slate-800 outline-none w-1/2">0.00</h1>
              }
              <div className="flex justify-center items-center flex-row">
                {

                  toToken?.token != undefined && <div className="ml-2 flex justify-start items-center flex-row bg-slate-700 p-1 rounded-full px-2">
                    <Image src={toToken?.token?.logoURI} alt="" width={22} height={22} className="rounded-full" />
                    <h1 className="text-slate-300 ml-1">{toToken?.token?.symbol}</h1>
                  </div>
                }
                {fromChain ? <button onClick={() => {
                  setChainVisible1(false)
                  setTokenVisible1(false)
                  setTokenVisible2(true)
                }}><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>
                  : <button title="Select chain" disabled><KeyboardArrowDownIcon className="text-slate-300 text-lg ml-2 rounded-full bg-slate-700" /></button>
                }
              </div>
            </div>
          </div>

        </>
        :
        <>
          {isTokenVisible2 && <Tokens fromChainId={fromChain.chain?.chainId} setToken={setToToken} setVisible={setTokenVisible2} />}
        </>
      }



      {loadRoute ?
        <>
          <CircularProgress size={20} className="mb-2 mt-4" />
          <h1 className="text-slate-400 mt-4">Fetching Routes... </h1>
        </>
        : (route != undefined && amount != '0.00') ? <div className="flex justify-start items-center flex-row w-full p-4 bg-slate-800 mt-4 rounded-md relative border border-violet-500">
          <Image src={route?.userTxs[0].protocol.icon} alt="" width={35} height={35} className="rounded-full" />
          <div className="flex justify-start items-start flex-col ml-3">
            <h1 className="text-slate-300 font-bold">{route?.userTxs[0].protocol.displayName}</h1>
            <div className="flex justify-start items-start flex-row">
              <h1 title={route?.outputValueInUsd.toFixed(4)} className="text-slate-200"><span className="text-slate-400">Est. Output: </span> {route.outputValueInUsd.toFixed(2)} (USD)</h1>
              <h1 className="mx-2 text-slate-400"> | </h1>
              <h1 title={(route?.userTxs[0].gasFees.feesInUsd).toFixed(2)} className="text-slate-200"><span className="text-slate-400">Gas Fees: </span>${(route.userTxs[0].gasFees.feesInUsd).toFixed(2)}</h1>
            </div>
          </div>
        </div>
        : <h1 className="text-slate-500 mt-4">No Route Found!</h1>}

      {
        loadRouteTran ? <button className="bg-violet-500 text-white font-bold text-base w-full p-3 rounded-lg mt-5" disabled>
          <CircularProgress size={20} color='secondary' />
        </button>
          : (route == null || route == undefined) ? <></> : <button className="bg-violet-500 text-white font-bold text-base w-full p-3 rounded-lg mt-5" onClick={getRouteTransaction}>
            Review Route
          </button>}

    </div>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={msg?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {msg?.messege}
        </Alert>
      </Snackbar>
  </div>
  </div>
}