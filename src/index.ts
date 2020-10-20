import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
//import { createConnection } from "typeorm";
import exp from "./app";
//import connectionOptions from "./ormConfig";
//import decodeJWT from "./utils/decodeJWT";
const mongoose = require('mongoose');
const dbConfig = require('../mongoconfig.json');





const PORT: number | string = process.env.PORT || 4000;
// const PLAYGROUND_ENDPOINT: string = "/playground";
// const GRAPHQL_ENDPOINT: string = "/graphql";
// const SUBSCRIPTION_ENDPOINT: string = "/subscription";

// const appOptions: GraphQLOptions = {
//   port: PORT,
//   playground: PLAYGROUND_ENDPOINT,
//   endpoint: GRAPHQL_ENDPOINT,
//   subscriptions: {
//     path: SUBSCRIPTION_ENDPOINT,
//     onConnect: async connectionParams => {
//       const token = connectionParams["X-JWT"];
//       if (token) {
//         const user = await decodeJWT(token);
//         if (user) {
//           return {
//             currentUser: user
//           };
//         }
//       }
//       throw new Error("No JWT. Can't subscribe");
//     }
//   }
// };

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

// createConnection(connectionOptions)
//   .then(() => {
//     app.start(appOptions, handleAppStart);
//   })
//   .catch(error => console.log(error));


  mongoose.connect(`mongodb://${dbConfig.user}:${dbConfig.password}@localhost:27017/`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: dbConfig.dbname })
  .then(()=>{
    
    exp.listen(PORT, handleAppStart);
  })
  .catch((error)=>{
    console.log("mongoose connect err = ", error)
  })