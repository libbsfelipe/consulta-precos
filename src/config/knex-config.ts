import knex from 'knex';

let cachedConnection;

export default function client() {

  try{
    cachedConnection.raw('select 1+1 as result')
  }
  catch(err){
    console.log('Sem conexão aberta, iniciando conexão...');

    cachedConnection = knex({
      client: 'mssql',
      connection: {
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        port: Number(process.env.DATABASE_PORT),
        host: process.env.DATABASE_HOST,
        ssl: {
          rejectUnauthorized: false
        }
      }
    });

  }
  
  return cachedConnection;
}
