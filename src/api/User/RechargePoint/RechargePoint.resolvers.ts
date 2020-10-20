//import {User} from "../../../entities/User";
import {
  RechargePointMutationArgs,
  RechargePointResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

//import checkRoomStatus from "../../../utils/checkRoomStatus";

// oneWordTags
// likeTags
  
  const resolvers: Resolvers = {
    Mutation: {
      RechargePoint: privateResolver(
        async (
          _,
          args: RechargePointMutationArgs,
          { req }
        ): Promise<RechargePointResponse> => {
          
          const user = req.user;
           
          try{
           
            const {point} = args;
            user.point = user.point + point;
            await user.save();
            return {
              ok: true,
              error: null,
              currentPoint: user.point
            }

          

          }catch(err){
            return {
              ok: false,
              error: err,
              currentPoint: null
            }


          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  