//import {User} from "../../../entities/User";
import {
    AddPhotoUrlMutationArgs,
    AddPhotoUrlResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {User} from "../../../entities/User"
import { InstanceType } from 'mongoose'
//import { InstanceType } from '@typegoose/typegoose';
  
  const resolvers: Resolvers = {
    Mutation: {
      AddPhotoUrl: privateResolver(
        async (
          _,
          args: AddPhotoUrlMutationArgs,
          { req }
        ): Promise<AddPhotoUrlResponse> => {
          
          const user : InstanceType<User>  = req.user;
          //console.log("req user = ", user);
          try{
            const {key, url, kind} = args;
            console.log("key, url = ", key, url)
            if(kind == "group"){
              if(user.groupphoto.length > 5){
                return {
                  ok: false,
                  error: "over 6 try"
                }
              } 
              user.groupphoto.push({key, url});
            }else{
              if(user.profilephoto.length > 5){
                return {
                  ok: false,
                  error: "over 6 try"
                } 
              }
              user.profilephoto.push({key, url});
            }
            
            console.log("after push user =  ", user)
            await user.save();
            
          
            return {
                ok: true,
                error: null
            }
          
         

          }catch(err){
            console.log(err)
            return {
              ok: false,
              error: err
             
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  