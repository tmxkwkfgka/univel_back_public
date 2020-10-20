//import {User} from "../../../entities/User";
import {
    ExtendRoomReadyMutationArgs,
    ExtendRoomReadyResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {firebaseService} from "../../../services"
  
  const resolvers: Resolvers = {
    Mutation: {
        ExtendRoomReady: privateResolver(
        async (
          _,
          args: ExtendRoomReadyMutationArgs,
          { req }
        ): Promise<ExtendRoomReadyResponse> => {
          
          const user = req.user;
          //console.log("req user = ", user);
          try{
            const {roomKey, point, extendTime, changeStatus, plusAtNow} = args;
            if(user.point < point){
              // 포인트 부족
              return {
                ok: false,
                error: "not enough point",
                waitingAt: null,
                currentPoint: null
              }
            }

            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            let extendResult = await firebaseService.extendRoomReady(roomKey, extendTime, changeStatus, plusAtNow)
            if(extendResult.ok){
              user.point = user.point - point;
               await user.save()
               return {
                ok: true,
                error: null,
                waitingAt: extendResult.waitingAt,
                currentPoint: user.point
              }


            }else{
              return {
                ok: false,
                error: extendResult.error? extendResult.error : "don't know",
                waitingAt: extendResult.waitingAt,
                currentPoint: null
              }


            }


          }catch(err){
            return {
              ok: false,
              error: err,
              waitingAt: null,
              currentPoint: user.point
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  