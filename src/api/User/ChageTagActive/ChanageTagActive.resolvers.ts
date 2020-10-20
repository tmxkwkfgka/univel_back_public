//import {User} from "../../../entities/User";
import {
    ChangeTagActiveMutationArgs,
    ChangeTagActiveResponse
  } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

  
  const resolvers: Resolvers = {
    Mutation: {
        ChangeTagActive: privateResolver(
        async (
          _,
          args: ChangeTagActiveMutationArgs,
          { req }
        ): Promise<ChangeTagActiveResponse> => {
          
          const user = req.user;
        
          try{
            
            const {tagKind, inputTags} = args;

            if(!inputTags[0]){
              return {
                ok: false,
                error: "not valid input"
              }

            }
            // user정보 로그인시 저장하지만 실시간 정보를 얻지 못하니까 그냥 쿼리롤 불러옴
            
            let tags = user[tagKind];

            inputTags.forEach((inputTag)=>{
              let index = tags.indexOf(tags.find(e=>e.name == inputTag.tagName))
              if (index > -1) {
                  tags[index].active = inputTag.active;
              }
              user[tagKind] = tags;
            })
            
            await user.save()
            
            return {
                ok: true,
                error: null
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
  