/* This example requires Tailwind CSS v2.0+ */
import { getSession } from 'next-auth/client';
/* This example requires Tailwind CSS v2.0+ */;
import { FormEvent, useEffect, useState } from 'react';
import Header from '../components/header';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ModalLoader from '../components/loaderModal';
import ModalSucess from '../components/sucessModal';
import ModalError from '../components/errorModal';
import api from 'axios';
import React from 'react';


export default function Example() {
    const route = useRouter();
    const [ean, setEan] = useState('');
    const [productName, setProductName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [showSucess, setShowSucess] = useState(false);
    const [showError, setShowError] = useState(false);
    const formRef = React.useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        api.get('http://localhost:3000/api/navigation-itens/product-card')
            .then((response) => {
                if(response.data.length == 0){
                    route.replace('/404');
                }
            }).catch((error) => {
                console.log(error);
                
            });
    }, []);

    const saveProduct = (event: FormEvent) => {
        try {
            event.preventDefault();
            setShowLoader(true);

            const formData = new FormData();
            formData.append('ean', ean);
            formData.append('productName', productName);
            formData.append('file', photo);

            api.post('/api/products/post/product', formData)
            .then((response) => {
                setShowLoader(false);
                setShowSucess(true);

                formRef.current?.reset();

                setTimeout(() => {
                    setShowSucess(false);
                }, 3000);

            }).catch((error) => {
                setShowLoader(false);
                setShowError(true);
                
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
            
        }
    }

    return (
        <div>
            <Head>
                <title>Monitoramento de Preços de Medicamentos - B2C</title>
            </Head>

            <ModalLoader showLoader={showLoader} setShowLoader={setShowLoader} text="Salvando..." />
            <ModalSucess showLoader={showSucess} setShowLoader={setShowSucess} text="Sucesso ao cadastrar produto." />
            <ModalError  showLoader={showError} setShowLoader={setShowError} text="Erro ao cadastrar produto." />

            <Header page="/product-registration" />

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-arial text-green-600">Cadastro de produtos para consulta</h1>
                </div>
            </header>
            <main>
                <div className="flex flex-col mt-6 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <form onSubmit={saveProduct} ref={formRef}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                            EAN
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                maxLength={13}
                                                name="ean"
                                                id="ean"
                                                value={ean}
                                                onChange={(e) => setEan(e.target.value)}
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 p-2 w-full rounded-md sm:text-sm border border-gray-300"
                                                placeholder="9999999999999999"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 sm:col-span-2">
                                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                            Nome do produto
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="product-name"
                                                id="product-name"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 p-2 w-full rounded-md sm:text-sm border border-gray-300"
                                                placeholder="Naprix A 5mg 30 comp."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Foto do produto</label>
                                    <div className="mt-1 flex items-center">
                                        <div className="inline-block h-48 w-40 overflow-hidden bg-gray-100 flex items-center">
                                            <img src={photo != null ? URL.createObjectURL(photo) : 'no-image.png'} alt={photo != null ? photo.name : 'no-image.png'} />
                                        </div>
                                        <div>
                                            <input
                                                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                type="file"
                                                onChange={(e) => {
                                                    setPhoto(e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    onClick={saveProduct}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: { session }
    }
}