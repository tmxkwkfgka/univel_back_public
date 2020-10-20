//import {User} from "../../../entities/User";
import {
    FindCrewQueryArgs,
    FindCrewResponse
  } from "../../../types/graph";
  import { Resolvers } from "../../../types/resolvers";
  //import cleanNullArgs from "../../../utils/cleanNullArg";
  import privateResolver from "../../../utils/privateResolver";
import { UserModel } from "../../../entities/User";
let moment = require("moment");
require('moment-timezone');





  const resolvers: Resolvers = {
    Query: {
      FindCrew: privateResolver(
        async (
          _,
          args: FindCrewQueryArgs,
          { req }
        ): Promise<FindCrewResponse> => {

         try{

            const {lng, lat, inputDistance} = args;
            const user  = req.user;

            if(!user){
              
              return {
                ok: false,
                error: "no user signin",
                searchedUser: null,
                distance: null,
                remain: null
              }

            }

            let now = new Date();
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            
            console.log("findcrew start last click remain now ", user.lastClick, user.remain, krTimeFormat(user.lastClick), krTimeFormat(now));
            // 13개 있는데 시간지나서 초기화 해야할때 
            // 
            
            // if(user.remain <= 0){
              //moment(serverTime).format("YYYY/MM/DD")
              if(krTimeFormat(user.lastClick) != krTimeFormat(now)){
                
                user.remain = 20;
                user.lastClick = now;
                let remainUpdateRes = await user.save();
                console.log("remianUpdateRes = ", remainUpdateRes);
               
              }else {
                // 같을때 오늘눌렀을때 
                if(user.remain <= 0){
                   // 횟수넘김
                   console.log("같을때 오늘눌렀을때 0이하일때")
                  return {
                   
                    ok: false,
                    error: null,
                    searchedUser: null,
                    distance: null,
                    remain: user.remain
      
                  }

                }
             

              }
            

            const me = await UserModel.findOne({_id: user._id})
            // 거리로 필터, 한번 매칭 안된 것은 피하고
            // 일단은 거리로만 한번에 20개정도 찾고 
            // {
            //     mocked: false,
            //     timestamp: 1512393631310,
            //     coords:
            //     {
            //       speed: 0,
            //       heading: 0,
            //       accuracy: 22.43400001525879,
            //       longitude: 106.84,
            //       altitude: 0,
            //       latitude: -6.24
            //     }
            //   }
            //20개 정도 필터할때 유저가 탈퇴한 경우도 생길수 있음 
            //그런 경우 그냥 match에서 거르는 것으로 
            //사진이 삭제되어서 사진이 안 나오는 것은 crew화면에서 예외처리 하도록 
            
            let distance = inputDistance;
            while(distance <= 1000){
              //console.log("find user = ", user)
              console.log("find user in crew user unlike, like, user._id = ", me.unlike, me.like, me._id)
         
              let searchedUser = await UserModel.find({
                loc: {
                    $geoWithin: { 
                        $centerSphere: [ [ lng, lat ], distance/6378.1 ]
                    }
                },
                  _id: { $nin: me.unlike? me.unlike.concat(me.like).concat(me._id) : [] },
                  gender: !me.gender,
                  "profilephoto.0": { "$exists": true }
              }).limit(20)

                if(searchedUser[0]){
                  return {
                    ok: true,
                    error: null,
                    searchedUser,
                    distance,
                    remain: me.remain
                  };

                }else{
                  distance += 20;
                }
                  

            }

            return {
              ok: false,
              error: "no more user around you",
              searchedUser: null,
              distance,
              remain: me.remain
            }
            

            // 가까운 애들 대량리턴이랑 unmatched unmatch 정보 같이 보내서 휴대폰 임시저장소에 저장해서 반복문 돌면서 서버에 요청하는 식으로?

         }catch(err){

             return {
                 ok: false,
                 error: err,
                 searchedUser: null,
                 distance: null,
                 remain: null
             }

         }
  
        }
      )
    }
  };

  const krTimeFormat = (tdate) => {
    let ret = moment.tz(tdate, "Asia/Seoul");
    ret = ret.subtract(5, 'hours');
    console.log("format kr=", ret.format("YYYY/MM/DD HH:mm:ss"))
    return ret.format("YYYY/MM/DD")

  }
  
  export default resolvers;
  