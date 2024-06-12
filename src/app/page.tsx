"use client"

import dynamic from 'next/dynamic'

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
})

const Charts = dynamic(() => import("@/components/charts"), {
  ssr: false,
})

export default function Home() {
  
  return <div className="bg-slate-950 w-screen h-screen">
    <Header />
    <Charts />
  </div>
}