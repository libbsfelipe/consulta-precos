import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import BackToPageButton from '../../components/backToPageButton';
import Head from 'next/head';
import ModalLoader from '../../components/loaderModal';
import ModalSucess from '../../components/sucessModal';
import ModalError from '../../components/errorModal';
import api from 'axios';
import axios from 'axios';
import Image from 'next/image'
var moment = require('moment');

interface Product {
    ean: string;
    productName: string;
    productImagePath: string;
}

interface Offers {
    storeId: number;
    storeLink: string;
    store: string;
    timestamp: string;
    price: string;
    offerLink: string;
}


export default function Example() {
    const route = useRouter();
    const [medicineOffers, setMedicineOffers] = useState<Offers[]>([]);
    const [ean, setEan] = useState(route.query.ean);
    const [product, setProduct] = useState<Product>();
    const [showLoader, setShowLoader] = useState(false);
    const [showSucess, setShowSucess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        try{
            setShowLoader(true);

            axios.get('/api/products/getByEan/' + ean).then((response) => {
                setProduct(response.data);
            }).catch((error) => {
                console.log(error);
            });

            axios.get('/api/eCommerces/get/' + ean).then((response) => {
                setMedicineOffers(response.data);
                setShowLoader(false);
            }).catch((error) => {
                console.log(error);
                setShowLoader(false);
            });
        }
        catch(e){
            console.log(e);
            setShowLoader(false);
        }
    }, []);

    return (
        <div>
            <Head>
                <title>Monitoramento de Preços de Medicamentos - B2C</title>
            </Head>

            <ModalLoader showLoader={showLoader} setShowLoader={setShowLoader} text="Buscando preços..." />

            <Header page="/dashboard" />

            <header className="bg-white shadow">

                <div className="max-w-7xl mx-auto flex flex-row py-6 px-4 sm:px-6 lg:px-8 items-center">
                    <div className=" mr-3">
                        <BackToPageButton link='/dashboard' />
                    </div>
                    <h1 className="text-3xl font-arial text-green-600">Consulta de Preços de Medicamentos - Libbs</h1>
                </div>
            </header>
            <div className="flex flex-col mt-6 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="min-w-full flex flex-row border-b-2 p-4 mb-8 items-center ">
                            <div className="max-h-25 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-20 lg:aspect-none">
                                <img
                                    src={product ? product.productImagePath : ''}
                                    alt="Naprix A"
                                    className="w-full object-center object-cover lg:w-full lg:h-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-center ml-8">
                                <div>
                                    <h3 className="text-md font-arial font-medium text-gray-700">
                                        <a href="/medicine">
                                            {product ? product.productName : ''}
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Vendido por
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Data e hora da consulta
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Preço do item
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {medicineOffers.map((offer) => (
                                        <tr key={offer.store}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-indigo-600 hover:text-indigo-900"><a href={"./history-offers/" + ean + "/" + offer.storeId} >{offer.store}</a></div>
                                                        <div className="text-sm text-gray-500">{offer.storeLink}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{moment(offer.timestamp).format('DD/MM/yyyy HH:mm')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-900">
                                                    {'R$ ' + offer.price}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href={offer.offerLink} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                                                    Acessar site
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
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