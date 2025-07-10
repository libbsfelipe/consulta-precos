/* This example requires Tailwind CSS v2.0+ */
import { getSession } from 'next-auth/client';
/* This example requires Tailwind CSS v2.0+ */;
import { SearchIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import CardMedicine from '../components/medicineCard';
import Header from '../components/header';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ModalLoader from '../components/loaderModal';
import api from 'axios';



interface Medicines {
    ean: string;
    productName: string;
    productImagePath: string;
}



export default function Example() {
    const route = useRouter();
    const [medicines, setMedicines] = useState<Medicines[]>([]);
    const [showLoader, setShowLoader] = useState(false);
    const [productName, setProductName] = useState('');
    const [cardNavigation, setCardNavigation] = useState([]);

    const onSearch = () => {
        try {
            setShowLoader(true);

            api.get('/api/products/get/' + encodeURIComponent(productName))
                .then((response) => {
                    //console.log(response.data);
                    setMedicines(response.data);
                    setShowLoader(false);
                }).catch((error) => {
                    console.log(error);
                    setShowLoader(false);
                });

            api.get('/api/navigation-itens/product-card')
                .then((response) => {
                    console.log(response.data);
                    setCardNavigation(response.data);
                }).catch((error) => {
                    console.log(error);
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

            <ModalLoader showLoader={showLoader} setShowLoader={setShowLoader} text="Aguarde..." />

            <Header page="/dashboard" />

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-arial text-green-600">Consulta de Preços de Medicamentos Libbs</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Replace with your content */}
                    <div className="px-4 py-6 sm:px-5">
                        <div>
                            <div className="mt-1 relative rounded-full shadow-md border-2 border-gray-100 border-solid">
                                <input
                                    type="text"
                                    name="Medicamento"
                                    id="price"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-full p-3.5"
                                    placeholder="Digite o nome da apresentação"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center m-2">
                                    <button onClick={() => onSearch()}>
                                        <SearchIcon className="w-6 h-6 text-blue-800" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /End replace */}
                    {/* Lista de produtos começa aqui */}
                    <div className="bg-white">
                        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {medicines.map((medicine) => (
                                <div key={medicine.ean} className="group relative border border-gray-300 border-solid rounded-md py-2 shadow-md pl-3 pr-3">
                                    <div className="mb-2 flex justify-end items-start">
                                        {cardNavigation.map((item) => 
                                            ( 
                                                <div key={item.id.toString()} onClick={() => route.push(item.route.replace('[ean]', medicine.ean))}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </div>
                                            )
                                        )}                                        
                                    </div>
                                    <div className="cursor-pointer" onClick={() => route.push('./product-offers/' + medicine.ean)}>
                                        <div className="w-full min-h-80  aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-45 lg:aspect-none ">
                                            <img
                                                src={medicine.productImagePath}
                                                alt={medicine.productName}
                                                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-center">
                                            <div>
                                                <h3 className="text-md font-arial font-medium text-blue-700">
                                                    <a >
                                                        <span aria-hidden="true" className="absolute" />
                                                        {medicine.productName}
                                                    </a>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Lista de produtos começa aqui */}
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