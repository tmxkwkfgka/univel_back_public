//import {firebaseService} from "../../../services"
const admin = require('firebase-admin');
  

const sendFcm = async (type: string, title: string, body: string, screen: String, tokens: [string]) => {
    let payload: any = null
    let options: any = null
    if(type == "notification" && tokens.length == 1 && tokens[0] ){
        options = {
            priority: 'high',
            
          };
    
         payload = {
            notification: {
               
                title: title,
                body: body,
                data: body,
                mesage: body,
                screen: screen
    
            }
        }
        return await admin.messaging().sendToDevice(tokens[0], payload, options)

    }else if(type == "data" && tokens.length == 1 && tokens[0]){
        // payload = {                
        //     data: {
        //         type: type,
        //         title: title,
        //         body: body,
        //         screen: screen
                
        //     },
        //     token: tokens[0],
         
        // };

        // return await admin.messaging().send(payload)
        options = {
            priority: 'high',
            
          };
    
         payload = {
            data: {
               
                title: title,
                body: body,
                data: body,
                mesage: body,
                screen: screen
    
            }
        }
        return await admin.messaging().sendToDevice(tokens[0], payload, options)
    }else if(type == "multiData" && tokens.length > 0 && tokens[0]){
        payload = {
            data: {
              type, title, body, screen
            },
            tokens: tokens
        }
        return await admin.messaging().sendMulticast(payload)
        //response.successCount + ' messages were sent successfully'

    }else{
        return null
    }
   
   
  
    //console.log("fcmResponse=", fcmResponse);
  
};
export default sendFcm;