'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
<<<<<<< HEAD
import loginRoutes from '../src/auth/auth.routes.js';
=======
import publicRoutes from '../src/publications/public.routes.js';
>>>>>>> ft/publicaciones

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
<<<<<<< HEAD
        this.loginPath = '/api_Gestor/v1/users'
=======
        this.publicPath = '/api_Gestor/v1/public'
>>>>>>> ft/publicaciones
        this.middlewares();
        this.conectarDB();
        this.routes();

        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
<<<<<<< HEAD
        this.app.use(this.loginPath, loginRoutes);
=======
        this.app.use(this.publicPath, publicRoutes);
>>>>>>> ft/publicaciones
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;