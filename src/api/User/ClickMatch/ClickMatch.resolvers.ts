//import {User} from "../../../entities/User";
import {
    ClickMatchMutationArgs,
    ClickMatchResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
//import checkRoomStatus from "../../../utils/checkRoomStatus";
import {UserModel} from "../../../entities/User"
import {firebaseService} from "../../../services"
import sendFcm from '../../../utils/sendFcm';

let moment = require("moment");
require('moment-timezone');

//const ObjectID = require('mongodb').ObjectID;
  
  const resolvers: Resolvers = {
    Mutation: {
      ClickMatch: privateResolver(
        async (
          _,
          args: ClickMatchMutationArgs,
          { req }
        ): Promise<ClickMatchResponse> => {
          
          const user = req.user;
          //console.log("req user = ", user);
          try{
            const {yourid, fromHitch} = args;
            let now = new Date();
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            
            console.log("click match start last click remain now ", user.lastClick, user.remain, moment(user.lastClick).format("YYYY/MM/DD"), moment(now).format("YYYY/MM/DD"));
            // 13개 있는데 시간지나서 초기화 해야할때 
            // 
            
            if(!fromHitch){
              if(krTimeFormat(user.lastClick) != krTimeFormat(now)){
              
                user.remain = 20;
                let remainUpdateRes = await user.save();
                console.log("remianUpdateRes = ", remainUpdateRes);
                
              }else {
                // 같을때 오늘눌렀을때 
                if(user.remain <= 0){
                    // 횟수넘김
                  return {
                    ok: true,
                    error: null,
                    matchIds: null,
                    nicknames: null,
                    photos: null,
                    roomKey: null,
                    waitingAt: null,
                    remain: user.remain
                  }
                }
              }

            }
   
            

            const me = await UserModel.findOne({_id: user._id})



            let matchIds : string[] | null = null;
            let nicknames: string[]  = [];
            let photos: string[]  = [];
            let newRoomKey: string = "";
            let waitingAt: any = null
            let yourBriefInfo: any = {
              _id: null,
              profilephoto: null,
              nickname: null
            }
            let myBriefInfo: any = {
              _id: null,
              profilephoto: null,
              nickname: null
            }
            const you = await UserModel.findOne({_id: yourid})
            //매칭될때 이미 매칭된것인지 중복체크 해야함
            if(me.beliked.some((v)=>v.userId.toString() == yourid)){
              // 사용자가 히치하이킹 된거 모르고 찾기에서 누르다 매칭된 경우, 히치하이킹 화면에서 누른경우
              console.log("in matching")
              
             
                //me.matches.push({userid: yourid, createdAt: new Date()})
                //nicknames = [me.nickname, you.nickname]
                //photos = [, ]
              myBriefInfo._id = user._id.toString()
              myBriefInfo.profilephoto = me.profilephoto[0] && me.profilephoto[0].url? me.profilephoto[0].url : ""
              myBriefInfo.nickname = me.nickname;
              myBriefInfo.gender = me.gender;

              yourBriefInfo._id = yourid
              yourBriefInfo.profilephoto = you.profilephoto[0] && you.profilephoto[0].url ? you.profilephoto[0].url : ""
              console.log(" yourBriefInfo.profilephoto = ", yourBriefInfo.profilephoto);
              yourBriefInfo.nickname =  you.nickname;
              yourBriefInfo.gender = you.gender;

              photos.push(myBriefInfo.profilephoto?  myBriefInfo.profilephoto : "")
              photos.push(yourBriefInfo.profilephoto?  yourBriefInfo.profilephoto : "")

              nicknames.push(myBriefInfo.nickname)
              nicknames.push(yourBriefInfo.nickname)
              console.log("nicknames = ", nicknames)
              
              //await me.save();
              


              matchIds = [me._id, yourid];
              //await UserModel.updateOne({_id: yourid}, { $push: { matches: {userid: user._id, createdAt: new Date()} } });  
              let newRoomObj= await firebaseService.createRoom(myBriefInfo, yourBriefInfo)
              newRoomKey = newRoomObj.roomKey;
              waitingAt = newRoomObj.waitingAt;
              console.log("before rooms update newRoomkey: ", newRoomObj)
           
              // 히치하이킹에 있는 beliked삭제 
              // 원래 updateOne이 맞을거 같음 
              // let updatedPull = await UserModel.updateOne({_id: user._id}, {$pull: { beliked: {'beliked.$.userId': you._id }}})
              // console.log("update result of pull = ", updatedPull)
              console.log("before user.beliked = ", user.beliked, you._id)
              const belikedElementToDel = user.beliked.find(element => {
                //console.log("ele = ", element)
                return element.userId.toString() == you._id.toString()
              });
              // 기존에 히치하이킹 목록에 있던것 삭제
              console.log(belikedElementToDel)
              me.beliked.pull(belikedElementToDel._id)
              console.log("after user.beliked = ", me.beliked)
              await me.save();
              
              // let updated = await UserModel.updateOne({'_id': me._id,'beliked.userId': ObjectID(targetId)}, {'$set': {'beliked.$.lock': false}})
              // console.log(updated);
              if(me.settings.HitchSuccessNotiOn === true && me.isLoggedIn === true){
                let meType = (me.myOs == "android")? "data"  : "notification";
                let meFcmResponse =await sendFcm(meType, "히치하이킹 성공!", you.nickname+"님과 히치하이킹에 성공했어요.","hitch", [me.fcmToken]);

              }
              //console.log("너의 정보 = ", you)
              if(you.settings.HitchSuccessNotiOn === true && you.isLoggedIn === true){
                let yourType = (you.myOs == "android") ? "data" : "notification";
                //console.log("너한테 fcm 보내기전 ", you);
                let youFcmResponse = await sendFcm(yourType, "히치하이킹 성공!", me.nickname+"님과 히치하이킹에 성공했어요.","hitch", [you.fcmToken])

              }

            }else{
              const beLikedResult = await UserModel.updateOne({_id: yourid}, {$push: {beliked: {userId: user._id, lock: true} }})
              console.log(beLikedResult);
            }

            let resultRemain = fromHitch? me.remain : me.remain -1;
            //중복체크해야함
            const likeResult = await UserModel.updateOne({_id: user._id}, {$push: { like: yourid }, $set: {lastClick: now, remain: resultRemain}})
           
            if(you.settings.getHitchNotiOn === true && you.isLoggedIn === true){
              const yourType = (you.myOs == "android")? "data"  : "notification";
              let beLikedFcmResponse = await sendFcm(yourType, "히치하이킹을 받았어요!", me.nickname+"님이 히치하이킹을 보냈어요.","hitch", [you.fcmToken])

            }
        
            console.log(likeResult);
    
          // { n: 1, nModified: 1, ok: 1 }
          // { n: 1, nModified: 1, ok: 1 }
            console.log("clickmatch new room = ", newRoomKey)
          if(likeResult.nModified > 0){
            return {
              ok: true,
              error: null,
              matchIds: matchIds,
              nicknames,
              photos,
              roomKey: newRoomKey==""? null : newRoomKey,
              waitingAt: waitingAt,
              remain: resultRemain

            }
          }else{
            return {
              ok: false,
              error: "update failed",
              matchIds: matchIds,
              nicknames,
              photos,
              roomKey: null,
              waitingAt: null,
              remain: null
            };
          }

          }catch(err){
            return {
              ok: false,
              error: err,
              matchIds: null,
              nicknames: null,
              photos: null,
              roomKey: null,
              waitingAt: null,
              remain: null
            };

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
  