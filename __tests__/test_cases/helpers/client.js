require("dotenv").config();
const AWS = require("aws-sdk/global");
const { AWSAppSyncClient, AUTH_TYPE } = require("aws-appsync");
const gql = require("graphql-tag");

const { GRAPHQLAPIURL, AWSREGION } = process.env;
const config = {
  url: GRAPHQLAPIURL,
  region: AWSREGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials,
  },
  disableOffline: true,
};
const appSyncClient = new AWSAppSyncClient(config);

async function mutate(query) {
  return await appSyncClient.mutate({
    mutation: gql(query),
  });
}

async function query(query) {
  return await appSyncClient.query({
    query: gql(query),
  });
}
module.exports = {
  mutate,
  query,
};
