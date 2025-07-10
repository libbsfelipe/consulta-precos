import dbConnection from '../../../../config/knex-config';
import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const multerConfig = require('../../../../config/multer-config');
const multer = require("multer");
const helmet = require("helmet");

import db from '../../../../../prisma/database';

const Product = (product) => (
    {
        ean: product.ean,
        productName: product.productName,
        productImagePath: product.productImagePath
    }
);

const fileUpload = multer(multerConfig);

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(404).json({ message: `Endpoint not found or no access.` });
    },
});

apiRoute.use(helmet());

apiRoute.use(fileUpload.single('file'));

apiRoute.post(async (req: any, res) => {
    try {
        const session = await getSession({ req });
        if (session) {
            // Signed in
            if (req.method === 'POST') {
                let productImagePath = '';
                let productImageName = '';

                const itens: any = await db.$queryRawUnsafe(`select t3.[id]
                        ,t3.[title]
                        ,t3.[route]
                        ,t3.[component]
                        ,t3.[accessId]
                    FROM [dbo].[tbl_navigation_option_monitor_b2c]as t3 inner join tbl_user_access_monitor_b2c as t4 on t3.accessId = t4.accessId
                    where t4.email = '${session.user.email}' and t3.title = 'Cadastro de medicamentos'`
                );

                if(itens.length == 0){
                    return res.status(404).json({ message: 'Not found or no access.' });
                }

                if (req.file) {
                    const { blobName, url } = req.file;
                    productImagePath = url.substring(0, url.indexOf('?'));;
                    productImageName = blobName;
                }
                else {
                    productImagePath = '/productsImages/no-image.png';
                }

                const { ean, productName } = req.body;

                const product = await db.tbl_products_monitor_b2c.create({
                    data: { 
                        ean, 
                        productName, 
                        productImagePath,
                        productImageName
                    },
                })

                res.status(200).json(product);
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
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Unexpected error.' });
    }
    finally {

    }

});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};