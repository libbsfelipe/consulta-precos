import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Provider } from 'next-auth/client'
import 'tailwindcss/tailwind.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>      
    </>
  )
}

export default MyApp;
