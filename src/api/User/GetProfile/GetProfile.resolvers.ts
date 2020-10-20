import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
  GetProfileQueryArgs,
  GetProfileResponse
} from "../../../types/graph";
import {UserModel} from "../../../entities/User"
const ObjectID = require('mongodb').ObjectID;

const resolvers: Resolvers = {
  Query: {
    GetProfile: privateResolver(async (_,   args: GetProfileQueryArgs, { req }) : Promise<GetProfileResponse> => {

      try{
        //const { user } = req;
        const { id } = args;


        const user = await UserModel.findOne({_id:  ObjectID(id)})
        return {
          ok: true,
          error: null,
          user
        };

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
