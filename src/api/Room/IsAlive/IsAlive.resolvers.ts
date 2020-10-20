//import {User} from "../../../entities/User";

import { Resolvers } from "../../../types/resolvers";


  const resolvers: Resolvers = {
    Mutation: {
        IsAlive: (parent, args, context, info)=>{
            return {
                ok: true,
                error: null
            }

        }
    }
  };
  
  export default resolvers;
  