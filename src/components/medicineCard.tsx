import { useRouter } from 'next/router';
import { useState } from 'react';

export default function MedicineCard(props) {
    const route = useRouter();
    const [medicine, setMedicine] = useState(props.medicine);

    return (
        <div key={medicine.ean} className="group relative border border-gray-300 border-solid rounded-md py-2 shadow-md pl-3 pr-3">
            <div className="mb-2 flex justify-end items-start">
                <div onClick={() =>  route.push('/product-registration/edit/' + medicine.ean) }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
            </div>
            <div className="cursor-pointer"  onClick={() => route.push('./product-offers/' + medicine.ean)}>
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
    )
}