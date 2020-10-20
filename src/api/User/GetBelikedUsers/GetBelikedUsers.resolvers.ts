import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {
    
    GetBelikedUsersResponse
  } from "../../../types/graph";
import {UserModel, User} from "../../../entities/User"

const resolvers: Resolvers = {
  Query: {
    GetBelikedUsers: privateResolver(async (_, __, { req }): Promise<GetBelikedUsersResponse> => {

      try{
        const user: User = req.user;
        console.log("getbeliked start!!")
       
        let usersPromises: Promise<User>[] = []
        if(user.beliked){
          user.beliked.forEach((belike)=>{
            usersPromises.push(UserModel.findOne({_id: belike.userId}))
          })
  
          let results = await Promise.all(usersPromises)
         console.log("getbliked result = ", results)
         
  
          
          // const userWithBeliked =user.populate('beliked').execPopulate();
          // console.log(userWithBeliked.beliked)
          return {
            ok: true,
            error: null,
            usersWithLock:  results.map((res, index)=>{
            
            if(!res){
              return {
                userId: res,
                lock: true
              }
            }

            if( user.beliked  && user.beliked[index]  ){
              return {
                userId: res,
                lock: user.beliked[index].lock 
              }
            }else{

              return {
                userId: res,
                lock: true
              }

            }
        
           }).filter((v)=>{
             if(v !== undefined && v!==null && v && v.userId){
               return true
             }else{
               return false
             }
           }).reverse() || null

          };

        }else{
          return {
            ok: false,
            error: "invalid value",
            usersWithLock: null
          };
        }
        

      }catch(err){
          console.log(err)
        return {
          ok: false,
          error: err,
          usersWithLock: null
        };


      }
     
    })
  }
};
export default resolvers;
