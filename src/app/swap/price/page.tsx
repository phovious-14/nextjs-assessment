"use client"

import { useData } from "@/context/DataProvider";
import Image from "next/image";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useRouter, useSearchParams } from "next/navigation"
import { ethers } from "ethers";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CircularProgress } from "@mui/material";
import detectEthereumProvider from '@metamask/detect-provider';

const API_KEY = "59048949-5033-4639-b626-6583d8ac3c98"

export default function Page() {

  const { data }: any = useData()
  const router = useRouter()
  const [loadAprrove, setLoadApprove] = useState(false)
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<any>({});

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const approveTransaction = async () => {
    const ethereum = await detectEthereumProvider();

    const provider = new ethers.BrowserProvider(ethereum as any);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    try {
      setLoadApprove(true)
      if (data.routerTransactionData.approvalData !== null) {
        const { allowanceTarget, minimumApprovalAmount } = data.routerTransactionData.approvalData;
        const response3 = await fetch(
          `https://api.socket.tech/v2/approval/check-allowance?chainID=${data.route.userTxs[0].chainId}&owner=${data.route.userTxs[0].sender}&allowanceTarget=${allowanceTarget}&tokenAddress=${data.route.userTxs[0].fromAsset.address}`,
          {
            method: "GET",
            headers: {
              "API-KEY": API_KEY,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const json3 = await response3.json();
        console.log("check allowance", json3.result);
        // If Bungee contracts don't have sufficient allowance
        let allowanceValue = json3.result.value;
        if (minimumApprovalAmount > allowanceValue) {
          const response4 = await fetch(
            `https://api.socket.tech/v2/approval/build-tx?chainID=${data.route.userTxs[0].chainId}&owner=${data.route.userTxs[0].sender}&allowanceTarget=${allowanceTarget}&tokenAddress=${data.route.userTxs[0].fromAsset.address}&amount=${data.route.fromAmount}`,
            {
              method: "GET",
              headers: {
                "API-KEY": API_KEY,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const json4 = await response4.json();
          console.log("get approval transaction data", json4.result);

          const tx = await signer.sendTransaction({
            from: json4.result?.from,
            to: json4.result?.to,
            value: '0x00',
            data: json4.result?.data,
          })

          console.log(await tx.wait());

        }
      }

      const tx = await signer.sendTransaction({
        from: data.route.userTxs[0].sender,
        to: data.routerTransactionData.txTarget,
        data: data.routerTransactionData.txData,
        value: data.routerTransactionData.value
      });

      // Initiates approval transaction on user's frontend which user has to sign
      const receipt = await tx.wait();

      console.log("Approval Transaction Hash :", receipt);
      setOpen(true)
      if (receipt?.hash) {
        setLoadApprove(false)
        setMsg({ messege: 'Token swapped!', type: 'success' })
        router.push('/')
      } else {
        setLoadApprove(false)
        setMsg({ messege: 'Transaction Failed', type: 'error' })
      }

    } catch (e) {
      setOpen(true)
      setMsg({ messege: 'Transaction Failed', type: 'error' })
      console.log(e);
    }
  }

  return <div className="bg-slate-950 h-screen w-screen flex justify-center items-center flex-row">
    <div className="w-[450px] bg-slate-900 rounded-2xl flex justify-start items-center flex-col p-4">
      <h1 className="w-full text-left text-slate-300 text-xl mb-2">Review Transaction</h1>
      <div className="flex justify-start items-start flex-col mt-2">
        <div className="flex justify-start items-center flex-row ">
          <Image src={data?.chain?.icon} alt="" width={30} height={30} className="rounded-full" /> <span className="text-slate-400 ml-2">Arbitrum</span>
        </div>
        <div className="flex justify-start items-start flex-row w-full">
          <div className="bg-slate-800 mt-4 rounded-md relative p-2 flex justify-start items-center flex-row w-[50%]">
            <Image src={data?.route?.userTxs[0].fromAsset.icon} alt="" width={25} height={25} />
            <h1 className="ml-2 text-slate-300">{data.route.userTxs[0].fromAmount / Math.pow(10, data.route.userTxs[0].fromAsset.decimals)} </h1>
            <h2 className="ml-2 text-slate-300">{data.route.userTxs[0].fromAsset.symbol}</h2>
          </div>
          <KeyboardDoubleArrowRightIcon className="mt-6 text-slate-500" />
          <div className="bg-slate-800 mt-4 rounded-md relative p-2 flex justify-start items-center flex-wrap w-[50%]">
            {data.route.userTxs[0].toAsset.icon != null && <Image src={data.route.userTxs[0].toAsset.icon} alt="" width={25} height={25} className="rounded-full mb-2" />}

            <h1 className="ml-2 text-slate-300 mb-2">{(data.route.userTxs[0].toAmount / Math.pow(10, data.route.userTxs[0].toAsset.decimals)).toFixed(6)} {data.route.userTxs[0].toAsset.symbol}</h1>

            <h1 className="ml-2 text-slate-500">(${(data.route.outputValueInUsd).toFixed(2)})</h1>
          </div>
        </div>

        <div className="flex justify-between items-center flex-row w-full mt-4">
          <h1 className="text-slate-500">Gas Fees:</h1>
          <div className=" flex justify-start items-center flex-row">
            <h1 className="text-slate-300">{data.route.userTxs[0].gasFees.gasAmount / Math.pow(10, data.route.userTxs[0].gasFees.asset.decimals)} <span>{data.route.userTxs[0].gasFees.asset.symbol}</span></h1>
            <h1 className="ml-2 text-slate-500">(${data.route.totalGasFeesInUsd.toFixed(4)})</h1>
          </div>
        </div>
        <div className="flex justify-between items-center flex-row w-full mt-4">
          <h1 className="text-slate-500">Dex:</h1>
          <div className=" flex justify-start items-center flex-row">
            <Image src={data.route.userTxs[0].protocol.icon} alt="" width={22} height={22} className="rounded-full" />
            <h2 className="ml-2 text-slate-500">{data.route.userTxs[0].protocol.displayName}</h2>
          </div>
        </div>
        <div className="flex justify-between items-center flex-row w-full mt-4">
          <h1 className="text-slate-500">Swap slippage:</h1>
          <div className=" flex justify-start items-center flex-row">
            <h1 className="text-slate-300">{data.route.userTxs[0].swapSlippage}%</h1>
          </div>
        </div>
      </div>

      {
        loadAprrove ? <button className="bg-violet-500 text-white font-bold text-base w-full p-3 rounded-lg mt-5" disabled>
          <CircularProgress size={20} color='secondary' />
        </button>:<button className="bg-violet-500 text-white font-bold text-base w-full p-3 rounded-lg mt-5" onClick={approveTransaction}>
        Approve Transaction
      </button>}
    </div>

    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
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
}