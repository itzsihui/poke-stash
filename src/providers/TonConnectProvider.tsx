import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const manifestUrl = window.location.origin + '/tonconnect-manifest.json';

export const TonConnectProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
};
