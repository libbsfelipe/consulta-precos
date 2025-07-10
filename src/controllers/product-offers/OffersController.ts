import pagueMenos from './PagueMenosController';
import drogariaSaoPaulo from './DrogariaSaoPauloController';
import drogaFuji from './DrogaFujiController';
import drogariaCatarinense from './DrogariaCatarinenseController';
import drogariaVenancio from './DrogariaVenancioController';
import extraFarma from './ExtraFarmaController';
import drogariaAraujo from './DrogariaAraujoController';
import drogariaSaoJoao from './DrogariaSaoJoaoController'
import dbConnection from '../../config/knex-config';
const moment = require('moment');

import db from '../../../prisma/database';

const OfferHistoryModel = (offer) => (
    {
        storeId: offer.storeId,
        ean: offer.ean,
        timestamp: new Date(offer.timestamp),
        price: offer.price
    }
);

export default async function offers(ean){

    const searchForStore = async (store: string) => {
        return await db.tbl_eCommerces_monitor_b2c.findFirst({
            where: {
                store:  store
            },
        });
        
    }

    try{
        const offers = [];

        offers.push(await pagueMenos(ean, searchForStore));
        offers.push(await drogariaSaoPaulo(ean, searchForStore));
        offers.push(await drogaFuji(ean, searchForStore));
        offers.push(await drogariaCatarinense(ean, searchForStore));
        offers.push(await drogariaVenancio(ean, searchForStore));
        offers.push(await extraFarma(ean, searchForStore));
        offers.push(await drogariaAraujo(ean, searchForStore));
        offers.push(await drogariaSaoJoao(ean, searchForStore));

        await saveHistoryOffer(offers.map((o) => OfferHistoryModel(o)));

        return offers;
    }
    catch(e){
        console.log(e);
    }
    finally{
    }
}

const saveHistoryOffer = async (offers) => {
    return await db.tbl_historyOffers_monitor_b2c.createMany({
        data: offers
      });
    
}