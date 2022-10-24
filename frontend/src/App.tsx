import { ChakraProvider } from '@chakra-ui/react'
import { ReactElement } from 'react';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { EduDAO } from './components/EduDAO';
import { SectionDivider } from './components/SectionDivider';
import { SignMessage } from './components/SignMessage';
import { WalletStatus } from './components/WalletStatus';

export function App(): ReactElement {
  return (
    <ChakraProvider>
      <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <SignMessage />
      <SectionDivider />
      <EduDAO />
    </ChakraProvider>
  );
}
