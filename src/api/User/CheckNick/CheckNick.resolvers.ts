//import {User} from "../../../entities/User";
import {
    CheckNickMutationArgs,
    CheckNickResponse
  } from "../../../types/graph";
  import { Resolvers } from "../../../types/resolvers";
  //import cleanNullArgs from "../../../utils/cleanNullArg";
  import privateResolver from "../../../utils/privateResolver";
  import {User, UserModel} from "../../../entities/User";



  const resolvers: Resolvers = {
    Mutation: {
      CheckNick: privateResolver(
        async (
          _,
          args: CheckNickMutationArgs,
          { req }
        ): Promise<CheckNickResponse> => {

         try{

            const nick = args.nickName;
            const user : User = await UserModel.findOne({nickname: nick}).exec();
            if(user){
               return {
                   ok: false,
                   error: null
               };
            }else{
               return {
                   ok: true,
                   error: null
                 };
   
            }

         }catch(err){
             return {
                 ok: false,
                 error: err
             }

         }
  
        }
      )
    }
  };
  
  export default resolvers;
  