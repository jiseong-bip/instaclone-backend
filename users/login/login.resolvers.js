import client from "../../client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        login: async (_, { username, password}) => {
            //find user with argument username
            //check password
            const user = await client.user.findFirst({ where: { username } });
            if(!user){
                return {
                    ok: false,
                    error: "user not found",
                }
            }
            const passwordOk = await bcrypt.compare(password, user.password);
            if(!passwordOk){
                return {
                    ok: false,
                    error: "Wrong Password",
                }
            }
            const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            };
        }
    }
}