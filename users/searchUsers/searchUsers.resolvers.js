import client from "../../client.js"

export default {
    Query: {
        searchUsers: async(_, {keywords}) => {
            client.user.findMany({
                where: {
                  username: {
                    mode: "insensitive",
                    startsWith: keywords,
                  },
                },
              })
        }
    }
}