
import {
  TestSendFcmMutationArgs,
  TestSendFcmResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import sendFcm from '../../../utils/sendFcm';


const resolvers: Resolvers = {
  Mutation: {
    TestSendFcm: async (
      _,
      args: TestSendFcmMutationArgs,
      { req }
    ): Promise<TestSendFcmResponse> => {
        const user = req.user;
      try {
        const {type, title, body, screen} = args;
        if (!user) {
          return {
            ok: false,
            error: "No user found with that phonenumber",
            
          };
        }
      
        const fcmToken = user.fcmToken;
        console.log(fcmToken)
        const fcmResponse = await sendFcm(type, title, body, screen? screen : "", [fcmToken])
        console.log("test send fcm response = ", fcmResponse, fcmResponse.results)

        return {
            ok: true,
            error: null,
          
        }
          
       
      } catch (error) {
          console.log(error)
        return {
          ok: false,
          error: error.message,
         
        };
      }
    }
  }
};
export default resolvers;
