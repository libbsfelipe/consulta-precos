import dbConnection from '../../../../config/knex-config';
import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
const multerConfig = require('../../../../config/multer-config');
const multer = require("multer");
const fs = require('fs')
const { promisify } = require('util')
const helmet = require("helmet");
const { BlobServiceClient } = require('@azure/storage-blob');


import db from '../../../../../prisma/database';

const ProductModelView = (product) => ({
    ean: product.ean,
    productName: product.productName,
    productImagePath: product.productImagePath
});

const UpdateProductModelView = (product) => ({
    productName: product.productName,
    productImagePath: product.productImagePath
});

const deleteFile = async (fileName) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.STORAGE_CONN_STRING);
    const containerClient = await blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const arquivoExiste = await blockBlobClient.exists();
    if(arquivoExiste){
        await containerClient.deleteBlob(fileName);
    }
}

const fileUpload = multer(multerConfig);

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req , res ) {
      res.status(404).json({ message: `Endpoint not found or no access.` });
    },
});

apiRoute.use(helmet());

apiRoute.use(fileUpload.single('file'));

apiRoute.put(async (req: any, res) => {
    try {
        const session = await getSession({ req });
        if (session) {
            // Signed in
            if (req.method === 'PUT') {

                const itens: any = await db.$queryRawUnsafe(`select t3.[id]
                        ,t3.[title]
                        ,t3.[route]
                        ,t3.[component]
                        ,t3.[accessId]
                    FROM [dbo].[tbl_navigation_option_monitor_b2c]as t3 inner join tbl_user_access_monitor_b2c as t4 on t3.accessId = t4.accessId
                    where t4.email = '${session.user.email}' and t3.title = 'Editar'`
                );

                if(itens.length == 0){
                    return res.status(404).json({ message: 'Not found or no access.' });
                }

                const { productName } = req.body;
                let productImagePath = '/productsImages/no-image.png';
                let productImageName = '';

                const product = await db.tbl_products_monitor_b2c.findUnique({
                    where: {
                        ean:  req.query.ean
                    },
                });

                if(!product){
                    res.status(404).json({ message: 'Product not found or permission denied.' });
                }

                if(req.file){
                    productImagePath = req.file.url.substring(0, req.file.url.indexOf('?'));
                    productImageName = req.file.blobName;
                    await deleteFile(product.productImageName);
                }
                else{
                    productImagePath = product.productImagePath;
                }
                
                const updatedProduct = await db.tbl_products_monitor_b2c.update({
                    where: {
                      ean: req.query.ean,
                    },
                    data: {
                        productName, 
                        productImagePath,
                        productImageName
                    },
                  });


                res.status(200).json(ProductModelView(updatedProduct));

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

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };