//import {User} from "../../../entities/User";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {UserModel} from "../../../entities/User"
//const ObjectId = require('mongodb').ObjectId; 

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {

        const {lat, lng, _id} = args
        //const user = await UserModel.findOne({_id});

        let updated = await UserModel.update({_id: _id}, {loc: {type:"Point", coordinates: [lng, lat]} })
        console.log(updated);




        // const user: User = req.user;
        // const notNull: any = cleanNullArgs(args);
        // if (notNull.password) {
        //   user.password = notNull.password;
        //   user.save();
        //   delete notNull.password;
        // }
        // try {
        //   await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: ""
          };
        // } catch (error) {
        //   return {
        //     ok: false,
        //     error: error.message
        //   };
        // }

      }
    )
  }
};

export default resolvers;
