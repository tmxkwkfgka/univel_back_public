import { UserModel} from "../../../entities/User";
import {
  UserSignInMutationArgs,
  UserSignInResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    UserSignIn: async (
      _,
      args: UserSignInMutationArgs
    ): Promise<UserSignInResponse> => {
      const { phonenumber } = args;
      try {
        const user = await UserModel.findOne({ phonenumber });
        if (!user) {
          return {
            ok: false,
            error: "No user found with that phonenumber",
            token: null,
            user: null
          };
        }
        const token = createJWT(user._id);
        return {
            ok: true,
            error: null,
            token,
            user
        }

          
       
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
          user: null
        };
      }
    }
  }
};
export default resolvers;
