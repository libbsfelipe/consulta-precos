import dbConnection from '../../../../config/knex-config';
import { getSession } from 'next-auth/client';
import offersController from '../../../../controllers/product-offers/OffersController';
import db from '../../../../../prisma/database';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const helmet = require("helmet");

const HistoryOfferModel = (offer) => ({
    id: offer.id,
    storeId: offer.storeId,
    ean: offer.ean,
    price: offer.price,
    timestamp: offer.timestamp
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(404).json({ message: `Endpoint not found or no access.` });
    },
});

apiRoute.use(helmet());

apiRoute.get( async (req: any, res) => {
    try {
        const session = await getSession({ req });
        if (session) {
            // Signed in
            if (req.method === 'GET') {

                const { param } = req.query

                if(param.length != 2){
                    return  res.status(400).json({ message: 'Bad request.' });
                }

                if(param[0].length != 13){
                    return  res.status(400).json({ message: 'Bad request.' });
                }

                if(!parseInt(param[1])){
                    return res.status(400).json({ message: 'Bad request.' });
                }

                const historyOffer = await searchForHistoryOffers(param[0], param[1]);

                res.status(200).json(historyOffer.map((o) => HistoryOfferModel(o)));

            }
            else {
                res.status(400).json({ message: 'Method not allowed in this route.' });
            }
        } else {
            // Not Signed in
            res.status(401).json({ message: 'You must be authorized to acess this route.' });
        }
        
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: 'Unexpected error.' });
    }
    finally{
        //db.destroy();
        return res.end();
    }
    
});


const searchForHistoryOffers: any = async (ean, storeId) => {
    return await db.$queryRaw`SELECT T1.[id] as id
    ,T1.[storeId] as storeId
    ,T1.[ean] as ean
    ,format(T1.[timestamp],'dd/MM/yyyy HH:mm') as timestamp
    ,FORMAT(T1.[price],'N2') as price
    FROM [dbo].[tbl_historyOffers_monitor_b2c] as T1
    where T1.[timestamp] >= DATEADD(MONTH, -6, GETDATE()) and T1.[storeId] = ${storeId} and T1.[ean] = ${ean} ORDER BY T1.[timestamp] ASC`;
}

export default apiRoute;