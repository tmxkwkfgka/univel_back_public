import jwt from "jsonwebtoken";
import {User, UserModel} from "../entities/User";

const decodeJWT = async (token: string): Promise<User | undefined> => {
   try {
      const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
      const { id } = decoded;
      //console.log(decoded)
      const user = await UserModel.findOne({ _id: id });
      //console.log("in decode jwt user = ", user)
     return user;
   } catch (error) {
     return undefined;
   }
};

export default decodeJWT;
