'use client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, base, mainnet, opBNB, optimism, polygon, zkSync, zora } from 'viem/chains'

// Your WalletConnect Cloud project ID
export const projectId = '234dc1f19fec2bacece84f63dd95d8d8'

// Create a metadata object
const metadata = {
    name: 'defi app',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    coinbasePreference: 'smartWalletOnly'
}

// Create wagmiConfig
const chains = [mainnet, arbitrum, polygon, zkSync, optimism, zora, base, opBNB]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// Create modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration,
    themeMode: 'dark'
})

export function Web3Modal({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}