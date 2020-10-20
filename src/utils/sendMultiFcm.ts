//import {firebaseService} from "../../../services"
const admin = require('firebase-admin');
  

const sendMultiFcm = async (type: string, title: string, body: string, tokens: [string]) => {
    let message: any = null
    if(type == "notification"){
        message = {                
            data: {
                notification:{
                    title: title,
                    body: body
                }
            },
            tokens: tokens
        };

    }
   
    let fcmResponse = await admin.messaging().sendMulticast(message)
    //console.log("fcmResponse=", fcmResponse);
    return {
        failureCount: fcmResponse.failureCount,
        failedTokens: fcmResponse.responses.map((resp, idx)=>{
            if(!resp.success)
                return tokens[idx];
            else
                return null;
        }).filter(v=> v != null)
    };
};
export default sendMultiFcm;