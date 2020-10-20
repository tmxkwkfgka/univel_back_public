//import {User} from "../../../entities/User";
import {
  EditUserMutationArgs,
  EditUserResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";


const resolvers: Resolvers = {
  Mutation: {
      EditUser: privateResolver(
      async (
        _,
        args: EditUserMutationArgs,
        { req }
      ): Promise<EditUserResponse> => {
        
      
        try{
        
             return {
              ok: true,
              error: null
            }


       



        }catch(err){
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
