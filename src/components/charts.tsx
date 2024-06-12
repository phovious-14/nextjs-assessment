import { useState } from "react";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { api_url_day, api_url_hour, api_url_minute } from "../../constant";
import FetchChart from "./fetchChartData";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Charts() {

  const [alignment, setAlignment] = useState<string | null>('1d');
  const [filterDateTime, setFilterDateTime] = useState({ api: api_url_minute, limit: 24 * 60 })
  const [token, setToken] = useState('ETH');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    let data = newAlignment == '7d' ? { api: api_url_hour, limit: 24 * 7 }
      : newAlignment == '1m' ? { api: api_url_hour, limit: 24 * 31 }
        : newAlignment == '1y' ? { api: api_url_day, limit: 366 }
          : newAlignment == 'all' ? { api: api_url_day, limit: 2000 }
            : { api: api_url_minute, limit: 24 * 60 }
    setFilterDateTime(data)
    setAlignment(newAlignment);
  };


  const handleChange = (event: SelectChangeEvent) => {
    setToken(event.target.value as string);
  };
  return (
    <div className='flex justify-start items-center flex-col w-screen mt-8'>

      <div className='flex justify-between items-center flex-row w-[50%] mb-4'>
        <div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={token}
          label="Select token"
          onChange={handleChange}
          className="text-white bg-white"
        >
          <MenuItem value={'ETH'} className="text-white" color="#fff">ETH</MenuItem>
          <MenuItem value={'BTC'}>BTC</MenuItem>
          <MenuItem value={'AAVE'}>AAVE</MenuItem>
        </Select>
        </div>
        <ToggleButtonGroup
        color="primary"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
          size='small'
          className="border border-white"
        >
          
          {alignment == '1d' 
          ? <ToggleButton value="1d" aria-label="left aligned">
            <span className="bg-white p-2 rounded-md">1d</span>
          </ToggleButton>
          : <ToggleButton value="1d" aria-label="left aligned">
          <span className="text-white p-2">1d</span>
        </ToggleButton>}
        {alignment == '7d' 
          ? <ToggleButton value="7d" aria-label="left aligned">
            <span className="bg-white p-2 rounded-md">7d</span>
          </ToggleButton>
          : <ToggleButton value="7d" aria-label="left aligned">
          <span className="text-white p-2">7d</span>
        </ToggleButton>}
        {alignment == '1m' 
          ? <ToggleButton value="1m" aria-label="left aligned">
            <span className="bg-white p-2 rounded-md">1m</span>
          </ToggleButton>
          : <ToggleButton value="1m" aria-label="left aligned">
          <span className="text-white p-2">1m</span>
        </ToggleButton>}
        {alignment == '1y' 
          ? <ToggleButton value="1y" aria-label="left aligned">
            <span className="bg-white p-2 rounded-md">1y</span>
          </ToggleButton>
          : <ToggleButton value="1y" aria-label="left aligned">
          <span className="text-white p-2">1y</span>
        </ToggleButton>}
        {alignment == 'all' 
          ? <ToggleButton value="all" aria-label="left aligned">
            <span className="bg-white p-2 rounded-md">all</span>
          </ToggleButton>
          : <ToggleButton value="all" aria-label="left aligned">
          <span className="text-white p-2">all</span>
        </ToggleButton>}
        </ToggleButtonGroup>
      </div>
      <FetchChart filterDateTime={filterDateTime} token={token} />
    </div>
  )
}