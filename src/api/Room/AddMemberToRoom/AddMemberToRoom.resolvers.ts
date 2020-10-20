//import {User} from "../../../entities/User";
import {
    AddMemberToRoomMutationArgs,
    AddMemberToRoomResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import {firebaseService} from "../../../services"
import { UserModel } from "../../../entities/User";
import sendFcm from '../../../utils/sendFcm';


//const admin = require('firebase-admin');
  
  const resolvers: Resolvers = {
    Mutation: {
        AddMemberToRoom: privateResolver(
        async (
          _,
          args: AddMemberToRoomMutationArgs,
          { req }
        ): Promise<AddMemberToRoomResponse> => {
          
          const user = req.user;
          //console.log("req user = ", user);
          try{
            const {inviteRoomId, inviteRoomGroup} = args;
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            let addMemberResult = await firebaseService.addMemberToRoom(user._id.toString(), user.nickname, user.profilephoto[0].url, user.gender, inviteRoomId, inviteRoomGroup)
            if(addMemberResult.ok){

               if(addMemberResult.changeActive){
                  let roomUserIds = addMemberResult.userIds;
                  let users = await UserModel.find({_id: {"$in": roomUserIds}})
                  // 빈스트링은 false뜸
                  let fcmTokens = users.map(v=>{return {fcmtoken: v.fcmToken, os: v.myOs, talkRoomCreatedNotiOn: v.settings.talkRoomCreatedNotiOn, isLoggedIn: v.isLoggedIn }})
                    // 모든 사람 초대완료 방이 active로 바뀜 모든멤버에게 대화방 생성되었다고 알림
                    // 설정값 noti 켜졌는지도 확인
                  let promises: any[] = [];
                  fcmTokens.forEach((obj)=>{
                    if(obj.os == "android" && obj.talkRoomCreatedNotiOn === true && obj.isLoggedIn === true){
                      promises.push(sendFcm("data", "대화방 생성!", "대화방 생성되었습니다.","message", [obj.fcmtoken]))
                    }else if(obj.talkRoomCreatedNotiOn === true && obj.isLoggedIn === true){
                      //ios 또는 null null일경우는 거의 없지만 null이면 noti로
                      promises.push(sendFcm("notification", "대화방 생성!", "대화방 생성되었습니다.","message", [obj.fcmtoken]))

                    }
                    
                  })

                  let response = await Promise.all(promises);
                  
                  
                  //let fcmResponse = await admin.messaging().send(message)
                  //let fcmResponse = await sendFcm("multiData", "대화방 생성!", "대화방 생성되었습니다.","message", fcmTokens)
                  console.log("fcmResponse=", response);
                  return {
                    ok: true,
                    error: null,
                    changeActive: true
                  }

                   

               }else{
                   // 새로운 인원 초대된거 알려야하나 ?
                return {
                    ok: true,
                    error: null,
                    changeActive: false
                   
                }

               }
             
             


            }else{
              console.log("새방실패= ")
                // let message = {
                  
                //     data: {
                //       title: "새방실패",
                //       body: "fcmtest"
                //     },
                //     token: user.fcmToken
                //   };
                //    let fcmResponse = await admin.messaging().send(message)
                //   console.log("fcmResponse=", fcmResponse);
              return {
                ok: false,
                error: addMemberResult.error? addMemberResult.error : "don't know",
                changeActive: false
              }


            }


          }catch(err){
            return {
              ok: false,
              error: err,
              changeActive: false
              
            };

          }
          
          
        }
      )
    }
  };
  
  export default resolvers;
  