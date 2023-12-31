import client from "../../client.js";
import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { protectedResolver } from "../users.utils.js";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  const { file } = await avatar;

  const readStream = file.createReadStream();
  const writeStream = createWriteStream(
    process.cwd() + "/uploads/" + file.filename
  );
  readStream.pipe(writeStream);
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword })
    }
  });
  if (updatedUser.id) {
    return {
      ok: true
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile."
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn)
  }
};
