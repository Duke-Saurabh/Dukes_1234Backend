import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { connectdb } from './src/dbs/dbs.connection.js';
import express from 'express';
import { app } from './src/app.js';


const port = process.env.PORT || 3000; // Set a default port in case it's not defined in .env

connectdb()
    .then(() => {
        app.on('error', (error) => {
            console.error('Express is not able to talk to the database. Error:', error);
        });
        app.listen(port, () => {
            console.log(`App is listening at PORT ${port}`);
        });
    })
    .catch((error) => {
        console.error(`Not able to connect to the database. Error at line 19 in index.js. Error:`, error);
    });

