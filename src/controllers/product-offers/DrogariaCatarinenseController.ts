import api from 'axios';
var moment = require('moment-timezone');

interface Offer {
    store: string;
    price: number;
    offerLink: string;
}

export default async function drogariaCatarinenseOffers(ean, searchForStore) {
    try {
        const store = await searchForStore('Drogaria Catarinense');

        const offer = {
            storeId: store.id,
            storeLink: store.baseUrl,
            store: store.store,
            timestamp: '1900-01-01',
            price: 0,
            offerLink: '#',
            ean: ean
        };

        await api.get('https://www.drogariacatarinense.com.br/api/catalog_system/pub/products/search?fq=alternateIds_Ean:' + ean).then((response) => {
            const offerLink = response.data[0].link;
            const price = response.data[0].items[0].sellers[0].commertialOffer.Price;
            offer.price = price;
            offer.offerLink = offerLink
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