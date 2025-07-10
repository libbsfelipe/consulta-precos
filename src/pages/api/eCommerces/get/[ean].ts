import dbConnection from '../../../../config/knex-config';
import { getSession } from 'next-auth/client';
import offersController from '../../../../controllers/product-offers/OffersController';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const helmet = require("helmet");

import db from '../../../../../prisma/database';

const OfferModelView = (offer) => ({
    storeId: offer.storeId,
    store: offer.store,
    timestamp: offer.timestamp,
    price: offer.price,
    offerLink: offer.offerLink
})

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(404).json({ message: `Endpoint not found or no access.` });
    },
});

apiRoute.use(helmet());

apiRoute.get(async (req: any, res) => {
    try {
        const session = await getSession({ req });
        if (session) {
            // Signed in
            if (req.method === 'GET') {


                const product = await db.tbl_products_monitor_b2c.findUnique({
                    where: {
                        ean:  req.query.ean
                    },
                });

                if(!product){
                    res.status(404).json({ message: 'Product not found or permission denied.' });
                }

                const offers = await offersController(product.ean);

                res.status(200).json(offers.map((o) => OfferModelView(o)));

            }
            else {
                res.status(400).json({ message: 'Method not allowed in this route.' });
            }
        } else {
            // Not Signed in
            res.status(401).json({ message: 'You must be authorized to acess this route.' });
        }
        res.end();
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: 'Unexpected error.' });
    }
    finally{
    }
    
});

export default apiRoute;