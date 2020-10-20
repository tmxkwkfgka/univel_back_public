import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: privateResolver(async (_, __, { req }) => {

      try{
        const { user } = req;

        return {
          ok: true,
          error: null,
          user
        };

      }catch(err){
        
        return {
          ok: false,
          error: err,
          
        };


      }
     
    })
  }
};
export default resolvers;
