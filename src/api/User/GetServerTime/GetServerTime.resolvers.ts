import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
    
    GetServerTimeResponse
} from "../../../types/graph";


const resolvers: Resolvers = {
  Mutation: {
    GetServerTime: privateResolver(async (_,  __, { req }) : Promise<GetServerTimeResponse> => {

      try{
        //const { user } = req;
        return {
            ok: true,
            error: null,
            time: new Date()
        }

      }catch(err){
        
        return {
          ok: false,
          error: err,
          time: null
        };


      }
     
    })
  }
};
export default resolvers;
