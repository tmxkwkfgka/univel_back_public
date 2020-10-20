//import {User} from "../../../entities/User";
import {
    DelPhotoUrlMutationArgs,
    DelPhotoUrlResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {User} from "../../../entities/User"
import { InstanceType } from 'mongoose'
//import { InstanceType } from '@typegoose/typegoose';
import AWS from 'aws-sdk';

var path = require('path');
  
  const resolvers: Resolvers = {
    Mutation: {
      DelPhotoUrl: privateResolver(
        async (
          _,
          args: DelPhotoUrlMutationArgs,
          { req }
        ): Promise<DelPhotoUrlResponse> => {
           
          AWS.config.loadFromPath(path.join(__dirname, '..', '..', '..', '..', 'aws_credentials.json'));
          const user : InstanceType<User>  = req.user;
        
          
          try{

            const {key, kind} = args;
            //let s3 = new AWS.S3();

            let delIndex = null;
            if(kind == "group"){
              user.groupphoto.forEach((v,i)=>{
                if(v.key == key){
                  delIndex = i;
                }
              })

            }else{
              user.profilephoto.forEach((v,i)=>{
                if(v.key == key){
                  delIndex = i;
                }
              })

            }
           
            if(delIndex !== null){
              if(kind == "group"){
                user.groupphoto.splice(delIndex, 1);
              }else{
                user.profilephoto.splice(delIndex, 1);
              }
              
              await user.save(); 
              // var params = {  Bucket: 'univelstatic', Key: key };
              // let s3res = await s3.deleteObject(params).promise()
              // console.log(s3res)
              return {
                ok: true,
                error: null,
              }
            }else{
              return {
                ok: false,
                error: "not found key",
              }

            }

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
  