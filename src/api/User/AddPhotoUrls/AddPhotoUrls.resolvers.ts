//import {User} from "../../../entities/User";
import {
    AddPhotoUrlsMutationArgs,
    AddPhotoUrlsResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {User} from "../../../entities/User"
import { InstanceType } from 'mongoose'
//import { InstanceType } from '@typegoose/typegoose';
  
  const resolvers: Resolvers = {
    Mutation: {
      AddPhotoUrls: privateResolver(
        async (
          _,
          args: AddPhotoUrlsMutationArgs,
          { req }
        ): Promise<AddPhotoUrlsResponse> => {
          
          const user : InstanceType<User>  = req.user;
          //console.log("req user = ", user);
          try{
            const {photoUrls} = args;
            
            photoUrls.forEach((photoUrl)=>{
                user.profilephoto.push({key: photoUrl.key, url: photoUrl.url});
               
            })
            
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
  