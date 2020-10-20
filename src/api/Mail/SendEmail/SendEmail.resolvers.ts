//import {User} from "../../../entities/User";
import {
    SendEmailMutationArgs,
    SendEmailResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
const nodemailer = require("nodemailer");
//import {firebaseService} from "../../../services"
  
  const resolvers: Resolvers = {
    Mutation: {
        SendEmail: privateResolver(
        async (
          _,
          args: SendEmailMutationArgs,
          { req }
        ): Promise<SendEmailResponse> => {
          
        
          //ready에서 inactive 바뀌는 부분만 여러개가 한꺼번에 바뀜
          try{
            let promises: Promise<SendEmailResponse>[]= []
            // let transporter = nodemailer.createTransport({
            //     sendmail: true,
            //     newline: 'unix',
            //     path: '/usr/sbin/sendmail'
            // });

          
            const {from, to, subject, body} = args;
            let transport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'univel.report@gmail.com',  // gmail 계정 아이디를 입력
                pass: 'report1017!'          // gmail 계정의 비밀번호를 입력
              }
            });
      

           

            let eventOnPromise = new Promise<SendEmailResponse>((resolve,reject)=>{
               
              var message = {

                // sender info
                from: from,
            
                // Comma separated list of recipients
                to: to,
            
                // Subject of the message
                subject: subject, 
            
                // plaintext body
                text: body,
            
                // HTML body
               
            };
            
            console.log('Sending Mail');
            transport.sendMail(message, function(error){
              if(error){
                  console.log('Error occured');
                  console.log(error.message);
                  return resolve({
                    ok: false,
                    error: error
                  });
              }
              return resolve({
                ok: true,
                error: null
              })
            })
              console.log('Message sent successfully!');
             
            //     transporter.sendMail({
            //         from: from,
            //         to: to,
            //         subject: subject,
            //         text: body
            //     }, (err, info) => {
                   
            //         if(err){
            //             return {
            //                 ok: false,
            //                 error: err,
                            
            //               };
    
            //         }
            //         console.log(info.envelope);
            //         console.log(info.messageId);
            //         return resolve({
            //             ok: true,
            //             error: null,
                        
            //           }); 
            //     });

            })
     

            promises.push(eventOnPromise)
    
        
            //delay_return(timeOut);
          
          
             promises.push(new Promise<SendEmailResponse>((resolve, reject)=>{
                setTimeout(()=>{
                  resolve({
                    ok: false,
                    error: "timeout"
                  })
                }, 20000)
              })
             )
  
             return Promise.race(promises)
             .then((res)=>{
               return res;
             })

          }catch(err){
            return {
              ok: false,
              error: err,
              
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  