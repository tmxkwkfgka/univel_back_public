//import {User} from "../../../entities/User";
import {
    UpdateMyLocMutationArgs,
    UpdateMyLocResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

import {UserModel} from "../../../entities/User"
//import checkRoomStatus from "../../../utils/checkRoomStatus";

// oneWordTags
// likeTags
  
  const resolvers: Resolvers = {
    Mutation: {
      UpdateMyLoc: privateResolver(
        async (
          _,
          args: UpdateMyLocMutationArgs,
          { req }
        ): Promise<UpdateMyLocResponse> => {
          const {lat, lng, locStr} = args;
          
          const user = req.user;
       
           
           
          try{
            console.log("start updateloc ", lat, lng, locStr  )
          
            let updatedUser = await UserModel.updateOne({_id: user._id}, {$set : {loc: {type: "Point", coordinates: [lng, lat]}, locStr: locStr}})
            console.log("update loc update user = ", updatedUser)
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
              console.log(err)
            return {
              ok: false,
              error: JSON.stringify(err),
              
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  