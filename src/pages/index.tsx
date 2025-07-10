import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../contexts/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/client'
/* This example requires Tailwind CSS v2.0+ */
import Login from './login';
import { useRouter } from 'next/router'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useEffect } from 'react';

const Main = styled.main`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
`;

const Cointainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0,82,164);
background: radial-gradient(circle, rgba(0,82,164,1) 0%, rgba(3,87,170,1) 18%, rgba(5,90,177,1) 51%, rgba(1,103,207,1) 85%, rgba(2,110,217,1) 99%);
  flex-direction: column;
`;



const Home: React.FC = () => {
  const route = useRouter();
  const [ session, loading ] = useSession();

  return (
    <Cointainer>
      <Head>
        <title>Monitoramento de Preços de Medicamentos - B2C</title>
      </Head>

      <Main>
        <Login />
      </Main>

      <footer>

      </footer>
    </Cointainer>
  )
}

export default Home;