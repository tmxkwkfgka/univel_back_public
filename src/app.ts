import cors from "cors";
import { NextFunction, Response } from "express";
//import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

import { ApolloServer } from 'apollo-server-express';
const express = require('express');
//const {graphiqlExpress,graphqlExpress} = require('apollo-server-express')
class App {
  public app: ApolloServer;
  //public pubSub: any;
  public exp: any
  constructor() {
    //this.pubSub = new PubSub();
    //this.pubSub.ee.setMaxListeners(99);
    this.app = new ApolloServer({
      schema,
      context: req => {
        const { connection: { context = null } = {} } = req;
        return {
          req: req.req,
          //pubSub: this.pubSub,
          context
        };
      }
    });

    this.exp = express();
    //this.exp.use('/graphql',graphqlExpress({schema}))
    //this.exp.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))
    this.exp.use(cors());
    this.exp.use(logger("dev"));
    this.exp.use(helmet());
    this.exp.use(this.jwt);

    this.app.applyMiddleware({app: this.exp})
    this.restApi();

    
   
  }
  // private middlewares = (): void => {
  //   this.app.express.use(cors());
  //   this.app.express.use(logger("dev"));
  //   this.app.express.use(helmet());
  //   this.app.express.use(this.jwt);
  // };

  private restApi(){
    this.exp.use('/GetServerTime', (req: any, res: any)=>{
      return res.json({
        ok: true,
        error:null,
        time: JSON.stringify(new Date())
        
      })
    })
  }

  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.get("X-JWT");
    //console.log(token)
    if (token) {
      //console.log("before decode token  = ", token)
      const user = await decodeJWT(token);
      //console.log("after decode user = ")
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}

export default new App().exp;