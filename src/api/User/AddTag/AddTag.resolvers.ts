//import {User} from "../../../entities/User";
import {
    AddTagMutationArgs,
    AddTagResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
//import checkRoomStatus from "../../../utils/checkRoomStatus";

// oneWordTags
// likeTags
  
  const resolvers: Resolvers = {
    Mutation: {
      AddTag: privateResolver(
        async (
          _,
          args: AddTagMutationArgs,
          { req }
        ): Promise<AddTagResponse> => {
          
          const user = req.user;
          
          try{
            const {inputTags, tagKind} = args;
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            inputTags.forEach((tag)=>{
              user[tagKind].push({name: tag, active: true})
            })
            
           
            await user.save()
            //checkRoomStatus("Gdgddfdf", 20000)
            
            return {
                ok: true,
                error: null
            }

            // let matchIds : string[] | null = null;
            // if(me.beliked.includes(yourid)){
            //   // 사용자가 히치하이킹 된거 모르고 찾기에서 누르다 매칭된 경우
            //   me.matches.push({userid: yourid, createdAt: new Date()})
            //   await me.save();
            //   await UserModel.updateOne({_id: yourid}, { $push: { matches: {_id: myid, createdAt: new Date()} } });  

            //   matchIds = [myid, yourid];

            // }
            // //중복체크해야함
            // const likeResult = await UserModel.updateOne({_id: myid}, {$push: { like: yourid }})
            // const beLikedResult = await UserModel.updateOne({_id: yourid}, {$push: {beliked: myid}})
            
            // console.log(likeResult);
            // console.log(beLikedResult);

           

          // { n: 1, nModified: 1, ok: 1 }
          // { n: 1, nModified: 1, ok: 1 }

          

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
  