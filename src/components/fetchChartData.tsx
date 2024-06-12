'use client'
import qs from 'qs'
import useSWR from 'swr'
import { api_key } from '../../constant'
import { useState } from 'react';

import ReactApexChart from "react-apexcharts";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { CircularProgress } from '@mui/material';

type FetcherParams = [string, Record<symbol, any>];

const fetcher = async ([url, params]: FetcherParams): Promise<any> => {
  const query = qs.stringify(params);
  const res = await fetch(`${url}?${query}`);
  return await res.json();
}

export default function FetchChart({filterDateTime ,token}:any) {

  const [newData, setNewData] = useState([])
  const { data, error, isLoading } = useSWR(
    [
      filterDateTime.api,
      {
        fsym: token,
        tsym: 'USDC',
        api_key,
        limit: filterDateTime.limit
      }
    ],
    fetcher,
    {
      onSuccess: (data) => {
        let d = data.Data.Data
        setNewData(d.map((item: any, index: Number) => [item.time * 1000, item.close]));
      }
    })

  if (isLoading) return <div className='flex justify-center items-center'><CircularProgress /></div>

  return <div>
    <ReactApexChart
      options={{
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy | HH:mm:ss',
          }
        },
        markers: {
          size: 0,
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime',          
          labels:{
            style:{
              colors:"#fff"
            }
          }
        },
        yaxis: {          
          labels:{
            style:{
              colors:"#fff"
            }
          }
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0, 
      }
      }}
      series={[
        {
          name: token,
          data: newData
        }
      ]}
      type="area"
      className='w-[800px] border border-slate-400 p-4 rounded-xl'
    />
  </div>
}