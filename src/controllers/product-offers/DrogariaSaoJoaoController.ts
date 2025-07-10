import api from 'axios';
var moment = require('moment-timezone');

interface Offer {
    store: string;
    price: number;
    offerLink: string;
}

export default async function drogariaSaoJoaoOffers(ean, searchForStore) {
    try {
        const store = await searchForStore('Drogaria São João');

        const offer = {
            storeId: store.id,
            storeLink: store.baseUrl,
            store: store.store,
            timestamp: '1900-01-01',
            price: 0,
            offerLink: '#',
            ean: ean
        };

        await api.get(`https://www.saojoaofarmacias.com.br/rest/V1/products?searchCriteria[currentPage]=1&searchCriteria[pageSize]=24&searchCriteria[filter_groups][0][filters][0][field]=ean&searchCriteria[filter_groups][0][filters][0][value]=${ean}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`).then((response) => {
            const price = response.data.items[0].price;
            offer.price = price;
            offer.offerLink = 'https://www.saojoaofarmacias.com.br/';
            offer.timestamp = moment().tz("America/Sao_Paulo").format();
        }).catch((error) => {
            console.log(error);
        });

        return offer;
    }
    catch (e) {
        console.log(e);
    }
    finally {

    }
}