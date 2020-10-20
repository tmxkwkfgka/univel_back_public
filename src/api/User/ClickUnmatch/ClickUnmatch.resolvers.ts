//import {User} from "../../../entities/User";
import {
    ClickUnmatchMutationArgs,
    ClickUnmatchResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
import { UserModel } from "../../../entities/User";
//import {UserModel} from "../../../entities/User"

let moment = require("moment");
require('moment-timezone');
const ObjectID = require('mongodb').ObjectID;

  
  const resolvers: Resolvers = {
    Mutation: {
      ClickUnmatch: privateResolver(
        async (
          _,
          args: ClickUnmatchMutationArgs,
          { req }
        ): Promise<ClickUnmatchResponse> => {
    
          try{
            const { yourid, delBelike, fromHitch } = args;
          

            const user = req.user;
            let now = new Date();
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            
            console.log("click unmatch start last click remain now ", user.lastClick, user.remain, moment(user.lastClick).format("YYYY/MM/DD"), moment(now).format("YYYY/MM/DD"));
            // 13개 있는데 시간지나서 초기화 해야할때 
            // 
            
            // if(user.remain <= 0){
              //moment(serverTime).format("YYYY/MM/DD")
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
                    remain: user.remain
                  }
                }
              }
              
            }
    
  
            const me = await UserModel.findOne({_id: user._id})
            console.log("your id = ", yourid)
            if(!me.unlike.includes(ObjectID(yourid))){
              console.log("unmatch include id포함", yourid)
              const unlikeResult = await UserModel.updateOne({_id: me._id}, {$push: { unlike: yourid }})
              // 두가지 경우 가능 히치하이킹 상세보기에서 unlike누른 경우 이경우는 beliked방이 삭제
              // 하지만 beliked방이 있는데 크루찾기에서 unlike 누른경우는 삭제하지 말아야함 
              if(delBelike === true)
               me.beliked = me.beliked.filter((belike)=>belike.userId.toString() != yourid);

              let changedRemain = me.remain - 1;
              me.lastClick = now;
              // 히치하이킹에서 프로필 좋아요 눌렀을때는 줄이지 않음
              me.remain = fromHitch? me.remain : changedRemain;
              let saveRes = await me.save()
              console.log("unmatch saveRes = ", saveRes);
              if(unlikeResult.nModified > 0){
                return {
                  ok: true,
                  error: null,
                  remain: changedRemain
                  
                };
              }else{
                return {
                  ok: false,
                  error: "update failed",
                  remain: null
                };
              }

            }else{

              console.log("히치 언라익 포함");
              if(fromHitch){
                if(delBelike === true)
                  me.beliked = me.beliked.filter((belike)=>belike.userId.toString() != yourid);
                
                  let saveRes = await me.save();
                  console.log("saveRes = ", saveRes);
                  return {
                    ok: true,
                    error: null,
                    remain: me.remain
    
                  }

              }

              return {
                ok: false,
                error: "already dislike",
                remain: null

              }
            }
          
            //const beUnlikedResult = await UserModel.updateOne({_id: yourid}, {$push: {beunliked: myid}})
            
           // console.log(unlikeResult);
            //console.log(beUnlikedResult);

          // { n: 1, nModified: 1, ok: 1 }
          // { n: 1, nModified: 1, ok: 1 }

          

          }catch(err){
            return {
              ok: false,
              error: err,
              remain: null
            };

          }
          


          //const {lat, lng, _id} = args
          //const user = await UserModel.findOne({_id});
  
          // let updated = await UserModel.update({_id}, {loc: {type:"Point", coordinates: [lng, lat]} })
          // console.log(updated);
          

  
     
          
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
  