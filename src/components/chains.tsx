"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import useSWR from "swr"
import './style.css'
import { CircularProgress } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'

export default function Chains({setChain, setVisible}:any) {

    const fetcher = async (url:string): Promise<any> => {
        const res = await fetch(url,
            {
                method: "GET",
                headers: {
                  "API-KEY": "59048949-5033-4639-b626-6583d8ac3c98",
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
            }
        );
        return await res.json();
      }
    
    const { data, error, isLoading } = useSWR(
        "https://api.socket.tech/v2/supported/chains",
        fetcher,
        {
          onSuccess: (data) => {
            console.log(data);        
          }
        })

    return <>
    
    <div className="w-full">
      <button onClick={() => setVisible(false)} className="p-2 bg-slate-800 ml-2 w-[10%] rounded-lg">
        <ClearIcon className="text-slate-200 text-base" />
      </button>
    </div><div className="bg-slate-900 w-[450px] h-[500px] p-2 overflow-y-scroll rounded-lg chain">
        {
            !isLoading ? data.result.map((chain:any, index:number) => <button 
              key={index} 
              className="flex justify-start items-center flex-row p-1 my-1 w-full hover:bg-slate-800 rounded-lg"
              onClick={() => {
                setChain({chain}) 
                setVisible(false)
              }}
            >
                <Image src={chain.icon} alt="" width={25} height={25} className="rounded-full" />
                <h1 className="text-slate-200 ml-2 text-sm">{chain.name}</h1>
            </button>)
            : <div className="h-full w-full flex justify-center items-center"><CircularProgress /></div>
        }
    </div>
    </>
}