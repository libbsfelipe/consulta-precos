import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
const helmet = require("helmet");

//const db = dbConnection();
import db from '../../../../prisma/database';
import { Prisma } from '@prisma/client';

const NavigationModelView = (item) => ({
    id: item.id.toString(),
    title: item.title,
    route: item.route,
    component: item.component,
    accessId: item.accessId
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

            const itens: any = await db.$queryRawUnsafe(`SELECT tbl_navigation_option_monitor_b2c.id
                    ,title
                    ,route
                    ,component
                    ,accessId
                FROM tbl_navigation_option_monitor_b2c inner join tbl_access_monitor_b2c on accessId = tbl_access_monitor_b2c.id
                where access = 'Livre' and component = '${req.query.component}'
                union select t3.[id]
                    ,t3.[title]
                    ,t3.[route]
                    ,t3.[component]
                    ,t3.[accessId]
                FROM [dbo].[tbl_navigation_option_monitor_b2c] as t3 inner join tbl_user_access_monitor_b2c as t4 on t3.accessId = t4.accessId
                where t4.email = '${session.user.email}' and t3.component = '${req.query.component}'`
            );

            res.status(200).json(itens.map((i) => NavigationModelView(i)));
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
    
})

export default apiRoute;