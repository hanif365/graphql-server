const typeDefs = `
  type Student {
    id: ID!
    name: String!
    age: Int
  }

  # Registration System of the application
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    username: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    students: [Student]
    student(id: ID!): Student

    users: [User]
    user(id:ID!): User
  }

  type Mutation {
    createStudent(name: String!, age: Int!): Student!
    updateStudent(id: ID!, name: String, age: Int): Student
    deleteStudent(id: ID!): Student

    # Registration System of the application
    register(name: String!, email: String!, phone: String!, username: String!, password: String!): String!
    signIn(email: String!, password: String!): AuthPayload!
  }

`;

export default typeDefs;
