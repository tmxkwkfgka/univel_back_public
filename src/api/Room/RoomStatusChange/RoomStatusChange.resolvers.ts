//import {User} from "../../../entities/User";
import {
    RoomStatusChangeMutationArgs,
    RoomStatusChangeResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import { firebaseService } from "../../../services"
//import {firebaseService} from "../../../services"
  
  const resolvers: Resolvers = {
    Mutation: {
        RoomStatusChange: privateResolver(
        async (
          _,
          args: RoomStatusChangeMutationArgs,
          { req }
        ): Promise<RoomStatusChangeResponse> => {
          
          const user = req.user;
          //console.log("req user = ", user);

          //ready에서 inactive 바뀌는 부분만 여러개가 한꺼번에 바뀜
          try{
          
            const {roomKeys, currentStatus, afterStatus} = args;

            let result = await firebaseService.changeRoomsStatus(roomKeys, currentStatus, afterStatus)
            if(result.ok){
              console.log(result.results)
              //트리거 필요?
              return {
                ok: true,
                error: null
              }


            }else{
              console.log(result.results)
              return {
                ok: true,
                error: result.error
              }

            }

          }catch(err){
            return {
              ok: false,
              error: err,
              
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  