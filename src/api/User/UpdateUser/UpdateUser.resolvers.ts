//import {User} from "../../../entities/User";
import {
    UpdateUserMutationArgs,
    UpdateUserResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs";
import {UserModel} from "../../../entities/User"
//import checkRoomStatus from "../../../utils/checkRoomStatus";

// oneWordTags
// likeTags
  
  const resolvers: Resolvers = {
    Mutation: {
      UpdateUser: privateResolver(
        async (
          _,
          args: UpdateUserMutationArgs,
          { req }
        ): Promise<UpdateUserResponse> => {
          
          const user = req.user;
        
           
           
          try{
            console.log("start edituser ", )
            const updatedObj = cleanUndefinedArgs(args, []);
            console.log("updatedObj= ", updatedObj)
            
            let updatedUser = await UserModel.updateOne({_id: user._id}, {$set: updatedObj})
            
            if(updatedUser.nModified > 0){
                return {
                    ok: true,
                    error: null
                }

            }else {
                return {
                    ok: false,
                    error: "update failed"
                }
            }
            
          


           

          // { n: 1, nModified: 1, ok: 1 }
          // { n: 1, nModified: 1, ok: 1 }

          

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
  