import bcrypt from "bcrypt";
import client from "../../client.js";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // check if username or email are already on DB.
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }]
          }
        });
        if (existingUser) {
          return {
            ok: false,
            error: "This username/password is already taken."
          };
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword
          }
        });
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return {
          ok: true,
          token
        };
      } catch (e) {
        return {
          ok: true,
          error: e
        };
      }
    }
  }
};
