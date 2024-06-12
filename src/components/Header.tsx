"use client"

import Link from "next/link"

export default function Header() {
    return <div className="flex justify-around items-center flex-row w-screen p-2">
        <w3m-button />
        <div className="flex justify-around items-center flex-row">
            <Link href="/" className="mr-4 text-white border border-white p-1 px-2">Chart</Link>
            <Link href="/swap" className="text-white border border-white p-1 px-2">Swap</Link>
        </div>
    </div>
}