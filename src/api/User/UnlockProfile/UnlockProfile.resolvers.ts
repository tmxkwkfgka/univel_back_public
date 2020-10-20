//import {User} from "../../../entities/User";
import {
    UnlockProfileMutationArgs,
    UnlockProfileResponse
  } from "../../../types/graph";
  import { Resolvers } from "../../../types/resolvers";
  //import cleanNullArgs from "../../../utils/cleanNullArg";
  import privateResolver from "../../../utils/privateResolver";
  import {UserModel} from "../../../entities/User"

  const ObjectID = require('mongodb').ObjectID;
  //const ObjectId = require('mongodb').ObjectId; 
  
  const resolvers: Resolvers = {
    Mutation: {
       UnlockProfile: privateResolver(
        async (
          _,
          args: UnlockProfileMutationArgs,
          { req }
        ): Promise<UnlockProfileResponse> => {

          try{

            const {targetId, point} = args
            const me = req.user
            
            if(me.point < point){
                return {
                    ok: false,
                    error: "not enough point",
                    currentPoint: null
                }
            }


            let updated = await UserModel.updateOne({'_id': me._id,'beliked.userId': ObjectID(targetId)}, {'$set': {'beliked.$.lock': false}})
            console.log(updated);

            
            me.point = me.point - point;
            await me.save();
  
  
            return {
              ok: true,
              error: null,
              currentPoint: me.point
            };
         
          }catch(err){
            return {
                ok: false,
                error: err,
                currentPoint: null
              };

          }
  
          
  
        }
      )
    }
  };
  
  export default resolvers;
  