'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import loginRoutes from '../src/auth/auth.routes.js';
import publicRoutes from '../src/publications/public.routes.js';
import userRoutes from '../src/users/user.routes.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.loginPath = '/api_Gestor/v1/users'
        this.publicPath = '/api_Gestor/v1/public'
        this.userPath = '/api_Gestor/v1/users'
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

        this.app.use(this.loginPath, loginRoutes);
        this.app.use(this.publicPath, publicRoutes);
        this.app.use(this.userPath, userRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;