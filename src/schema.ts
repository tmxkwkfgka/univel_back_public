import { GraphQLSchema, GraphQLScalarType } from "graphql";
import { Kind } from 'graphql/language';
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

const allTypes: GraphQLSchema[] = fileLoader(
  path.join(__dirname, "./api/**/*.graphql")
);

const allResolvers = fileLoader(
  path.join(__dirname, "./api/**/*.resolvers.*")
);

const dateScalarType =new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue : (value) => {
    console.log("parsevalue = ", value)
    return new Date(value); // value from the client
  },
  serialize : (value) => {
    console.log("serialize = ", value)
    return value; // value sent to the client
  },
  parseLiteral: (ast) => {
    console.log("ast = ", ast)
    if (ast.kind === Kind.INT) {
      return new Date(ast.value) // ast value is always in string format
    }
    return null;
  }
})

const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);
mergedResolvers["Date"] = dateScalarType

const schema = makeExecutableSchema({
  typeDefs: mergedTypes,
  resolvers: mergedResolvers
});

export default schema;
