//import {User} from "../../../entities/User";
import {
    GetUsersFcmMutationArgs,
    GetUsersFcmResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import { UserModel } from "../../../entities/User";
  
  const resolvers: Resolvers = {
    Mutation: {
        GetUsersFcm: privateResolver(
        async (
          _,
          args: GetUsersFcmMutationArgs,
          { req }
        ): Promise<GetUsersFcmResponse> => {
          
          try{
            let userIds = args.userIds;
            if(!userIds){
              return {
                ok: false,
                error: "not valid argu(userids)",
                fcms: null,
                oss: null,
                getNewMessageNotiOns: null,
                currentRoomNames: null,
                threeRemainNotiOns: null,
                isLoggedIns: null
              }

            }
            
            let users = await UserModel.find({ _id: { "$in" : userIds} }, 'fcmToken myOs settings currentRoomName isLoggedIn');
            let tokens = users.map((v)=>v.fcmToken);
            let oss = users.map((v)=>v.myOs);
            let getNewMessageNotiOns = users.map((v)=>v.settings.getNewMessageNotiOn);
            let currentRoomNames = users.map((v)=>v.currentRoomName);
            let threeRemainNotiOns = users.map((v)=>v.settings.threeRemainNotiOn);
            let isLoggedIns= users.map((v)=>v.isLoggedIn);
            
              return {
                ok: true,
                error: null,
                fcms: tokens,
                oss,
                getNewMessageNotiOns,
                currentRoomNames,
                threeRemainNotiOns,
                isLoggedIns

              }

          }catch(err){
            return {
              ok: false,
              error: err,
              fcms: null,
              oss: null,
              getNewMessageNotiOns: null,
              currentRoomNames: null,
              threeRemainNotiOns: null,
              isLoggedIns: null
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  