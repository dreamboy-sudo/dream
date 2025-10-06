'use client';

import { DreamModeProvider } from '@/contexts/DreamModeContext';
import {PrivyProvider} from '@privy-io/react-auth';
import {SmartWalletsProvider} from '@privy-io/react-auth/smart-wallets';


export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <DreamModeProvider>
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          showWalletLoginFirst: true,
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://pbs.twimg.com/profile_images/1850340064754118656/6pbgPzq4_400x400.jpg',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
      }}
    >
      <SmartWalletsProvider>
        {children}
      </SmartWalletsProvider>
    </PrivyProvider>
    </DreamModeProvider>
  );
}