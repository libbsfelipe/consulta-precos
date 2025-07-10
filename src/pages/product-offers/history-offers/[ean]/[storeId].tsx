import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import LineGraph from '../../../../components/lineGraph';
import Header from '../../../../components/header';
import BackToPageButton from '../../../../components/backToPageButton';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import ModalLoader from '../../../../components/loaderModal';
import axios from 'axios';
var moment = require('moment');
import { LineChart, XAxis, Tooltip, CartesianGrid, Line, YAxis, Legend, ComposedChart, Area } from "recharts";


interface PriceHistory {
    id: number;
    storeId: number;
    ean: string;
    price: number;
    timestamp: string;
}

interface Product {
    ean: string;
    productName: string;
    productImagePath: string;
}

const PriceHistoryModel = (history) => {
    return {
        id: history.id,
        storeId: history.storeId,
        ean: history.ean,
        price: history.price,
        timestamp: history.timestamp
    }
}

export default function Example() {
    const route = useRouter();
    const [product, setProduct] = useState<Product>({ ean: '', productName: '', productImagePath: '' });
    const [ean, setEan] = useState(route.query.ean);
    const [storeId, setStoreId] = useState(route.query.storeId);
    const [historyOffers, setHistoryOffers] = useState<PriceHistory[]>([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showSucess, setShowSucess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        try {
            setShowLoader(true);

            axios.get('/api/products/getByEan/' + ean).then((response) => {
                setProduct(response.data);
            }).catch((error) => {
                console.log(error);
            });

            axios.get('/api/eCommerces/historyOffer/' + ean + '/' + storeId).then((response) => {
                setHistoryOffers(response.data.map((e) => PriceHistoryModel(e)));
                setShowLoader(false);
            }).catch((error) => {
                console.log(error);
                setShowLoader(false);
            });
        }
        catch (e) {
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
                    <h1 className="text-3xl font-arial text-green-600">Histórico de preços</h1>
                </div>
            </header>
            <div className="flex flex-col mt-6 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="min-w-full flex flex-row border-b-2 p-4 mb-8 items-center ">
                            <div className="max-h-25 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-20 lg:aspect-none">
                                <img
                                    src={product.productImagePath}
                                    alt="Naprix A"
                                    className="w-full object-center object-cover lg:w-full lg:h-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-center ml-8">
                                <div>
                                    <h3 className="text-md font-arial font-medium text-gray-700">
                                        <a href="/medicine">
                                            {product.productName}
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg flex items-center justify-center p-8">
                            <div className="w-full flex justify-center p-8">
                                <ComposedChart
                                    width={800} height={350} data={historyOffers}
                                    margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4ACEFF" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4ACEFF" stopOpacity={0.15} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="timestamp" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area dataKey="price" fillOpacity={1} fill="url(#colorPrice)" stroke="#00AEEF" strokeWidth={3} />
                                </ComposedChart >
                            </div>
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