"use client"
import useSWR from "swr"
import './style.css'
import qs from 'qs'
import { CircularProgress } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import { useState } from "react"

export default function Tokens({ fromChainId, setToken, setVisible }: any) {

  const [tokenList, setTokenList] = useState([])
  const [filterData, setFilterData] = useState([])

  const fetcher = async ([url, params]: any): Promise<any> => {
    const query = qs.stringify(params);
    const res = await fetch(`${url}?${query}`,
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
    [
      "https://api.socket.tech/v2/token-lists/to-token-list",
      {
        fromChainId,
        toChainId: fromChainId
      }
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setTokenList(data.result);
        setFilterData(data.result);
        console.log(data.result);
        
      }
    })

  const filteringTokens = (token: string) => {
    setTimeout(() => setFilterData(tokenList.filter((item) => item.symbol.includes(token.toUpperCase()))), 1000)    
  }

  return <>
    <div className="w-full">
      <input type="text" className="bg-slate-800 mb-2 w-[87%] outline-none p-2 text-slate-200 rounded-lg" placeholder="Type Token" onChange={(e) => filteringTokens(e.target.value)} />
      <button onClick={() => setVisible(false)} className="p-2 bg-slate-800 ml-2 w-[10%] rounded-lg" >
        <ClearIcon className="text-slate-200 text-base" />
      </button>
    </div>
    <div className="bg-slate-900 w-[450px] h-[500px] p-2 overflow-y-scroll rounded-lg overflow-x-hidden">
      {
        !isLoading ? filterData.map((token: any, index: number) => <button
          key={index}
          className="flex justify-start items-center flex-row p-2 my-1 w-full hover:bg-slate-800 rounded-lg"
          onClick={() => {            
            setToken({ token })
            setVisible(false)
          }}
        >
          <div className="flex justify-start items-start flex-col">
            <h1 className="text-slate-200 ml-2 text-sm">{token.name}</h1>
            <h1 className="text-slate-400 ml-2 text-[0.7rem]">{token.symbol}</h1>
          </div>
        </button>)
          : <div className="h-full w-full flex justify-center items-center"><CircularProgress /></div>
      }

    </div>
  </>
}