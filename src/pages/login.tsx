import { LockClosedIcon } from '@heroicons/react/solid'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import ModalLoader from '../components/loaderModal';

export default function Login() {
    const [ session, loading ] = useSession();
    const [showLoader, setShowLoader] = useState(false);
    const route = useRouter();
    
    useEffect(() => {        
        if(session){
            setShowLoader(false);
            route.push('/dashboard');
        }
    }, []);

    useEffect(() => {
        if(session){    
            route.push('/dashboard');
        }
    }, [session]);

    const handleSignIn = () => {
        setShowLoader(true);
        signIn('azure-ad-b2c').then(() => {
            setShowLoader(false);
        }).catch(() => {
            setShowLoader(false);
        });
    }

    return (
        <>
        <ModalLoader showLoader={loading} setShowLoader={setShowLoader} text="Aguarde..." />

            <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                <img
                    className="mx-auto h-20 w-auto"
                    src="libbs_logo.png"
                    alt="Workflow"
                />
                <h2 className="mt-6 text-center text-3xl font-arial text-white">Bem vindo ao sistema Monitor B2C</h2>
                <p className="mt-2 text-center text-sm text-white">
                    Por aqui é você pode buscar históricos e preços de medicamentos em tempo real!
                </p>          
                </div>

                <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleSignIn()}
                >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-green-900 group-hover:text-white" aria-hidden="true" />
                    </span>
                    Entrar com conta corporativa
                </button>
                </div>
            </div>
            </div>

        </>
    )
}