//import {User} from "../../../entities/User";
import {
   
    DeleteUserResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

import {DeletedUserModel} from "../../../entities/DeletedUser"
import {UserModel} from "../../../entities/User"




  
  const resolvers: Resolvers = {
    Mutation: {
      DeleteUser: privateResolver(
        async (
          _,
          __,
          { req }
        ): Promise<DeleteUserResponse> => {
           
        
          
          try{

            const user = req.user;
            let insertedUser = user.toObject();
            
            delete insertedUser.__v;
            delete insertedUser._id;
            //console.log("inserted User = ", insertedUser);
            let insertRes = await DeletedUserModel.create(insertedUser)
            // Object.keys(insertedUser).forEach((key)=>{
            //   console.log(key, insertedUser[key]);
            // })
            console.log("before delete copy result = ", insertRes);

            let deleteRes = await UserModel.deleteOne({_id: user._id})
            console.log("delete result = ", deleteRes);
            return {
                ok: true,
                error: null
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
  