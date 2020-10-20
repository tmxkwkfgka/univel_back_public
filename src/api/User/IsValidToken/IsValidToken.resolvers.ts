import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
    
    IsValidTokenResponse
} from "../../../types/graph";


const resolvers: Resolvers = {
  Mutation: {
    IsValidToken: privateResolver(async (_,  __, { req }) : Promise<IsValidTokenResponse> => {

      try{
        const { user } = req;
        if(user){
            return {
                ok: true,
                error: null,
                user
              };

        }else{
            return {
                ok: false,
                error: "not valid token",
                user: null
              };

        }
       

      }catch(err){
        
        return {
          ok: false,
          error: err,
          user: null
        };


      }
     
    })
  }
};
export default resolvers;
