//import {User} from "../../../entities/User";
import {
  EditPhotoUrlMutationArgs,
  EditPhotoUrlResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import AWS from 'aws-sdk';
import {firebaseService} from "../../../services";

var path = require('path');

//import { InstanceType } from '@typegoose/typegoose';

const resolvers: Resolvers = {
  Mutation: {
    EditPhotoUrl: privateResolver(
      async (
        _,
        args: EditPhotoUrlMutationArgs,
        { req }
      ): Promise<EditPhotoUrlResponse> => {
        
        AWS.config.loadFromPath(path.join(__dirname, '..', '..', '..', '..', 'aws_credentials.json'));
        const {user}  = req;
        
        try{
          const { previousKey, newKey, newUrl, kind} = args;
          //let s3 = new AWS.S3();
          console.log( previousKey, newKey, newUrl)
        
          let changed = false;
          if(kind == "group"){
            
            user.groupphoto = user.groupphoto.map((s3obj)=>{
              if(s3obj.key == previousKey && !changed){
                console.log("success previous url", previousKey)
                  changed = true
                 
                  return {key: newKey, url:newUrl}
              }else{
                  return s3obj
              }
            })

          }else{
            user.profilephoto = user.profilephoto.map((s3obj)=>{
              if(s3obj.key == previousKey && !changed){
                console.log("success previous url", previousKey)
                  changed = true
                 
                  return {key: newKey, url:newUrl}
              }else{
                  return s3obj
              }
            })

          }


          
          
          await user.save()
             
          if(changed){
            // var params = {  Bucket: 'univelstatic', Key: previousKey };

            // let s3res = await s3.deleteObject(params).promise()
            // console.log("s3res = ", s3res)
            if(kind == "firstProfile"){
             firebaseService.changeRoomPhoto(user._id.toString(), newUrl)
              .then((result)=>{
                console.log("change room photo result = ", result)
              })
              
            }
            return {
                ok: true,
                error: null,   
            }
          }else{
            if(kind == "firstProfile"){
              firebaseService.changeRoomPhoto(user._id.toString(), newUrl)
              .then((result)=>{
                console.log("change room photo result = ", result)
              })
              //console.log("change room photo result = ", result)
            }
              return {
                  ok: false,
                  error: "not changed",
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
