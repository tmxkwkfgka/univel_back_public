import { UserModel} from "../../../entities/User";
//import Verification from "../../../entities/Verification";
import {
  UserSignUpMutationArgs,
  UserSignUpResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";
import cleanUndefinedArgs from '../../../utils/cleanUndefinedArgs';


const resolvers: Resolvers = {
  Mutation: {
    UserSignUp: async (
      _,
      args: UserSignUpMutationArgs
    ): Promise<UserSignUpResponse> => {
       
       const createdObj = cleanUndefinedArgs(args, []);


       try{

        const user = await UserModel.findOne({ uid: args.uid });

        if(user){
          //이미 가입되어 있으면
          return {
            ok: false,
            error: "already_registerd",
            token: null,
            user
          };

        }else{
          const newUser = await UserModel.create(createdObj);
          console.log(newUser._id)
          const token = createJWT(newUser._id);
          return {
            ok: true,
            error: null,
            token,
            user: newUser
            
          };

        }

       }catch(err){
        return {
          ok: false,
          error: err,
          token: null,
          user: null
        };

       }
   
    }
  }
};

export default resolvers;
