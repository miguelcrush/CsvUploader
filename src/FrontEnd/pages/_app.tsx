import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Content } from '../components/Content';
import { Header } from '../components/Header';
import theme from '../theme/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Content>
        <Component {...pageProps} />
      </Content>
    </ChakraProvider>
  )
}
