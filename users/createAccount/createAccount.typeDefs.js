import { gql } from "apollo-server";

export default gql`
    type createResult{
        ok: Boolean!
        error: String
        token: String
    }

    type Mutation {
        createAccount(
            firstName: String!
            lastName: String
            username: String!
            email: String!
            password: String!
        ): createResult!
    }
`;