import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as db from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //* Database code here //

    const table = new db.Table(this, "Table", {
      tableName: "cdk-graphql-codeless-demo-table",
      partitionKey: {
        name: "id",
        type: db.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //* API codes here //
    const api = new appsync.GraphqlApi(this, "API", {
      name: "cdk-graphql-codeless-demo-api",
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, "../graphql/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
    });
    api.node.addDependency(table);

    // print the AppSync API endpoint
    new cdk.CfnOutput(this, "GRAPHQLAPIURL", {
      exportName: "GRAPHQLAPIURL",
      value: api.graphqlUrl || "",
    });
    new cdk.CfnOutput(this, "AWSREGION", {
      exportName: "AWSREGION",
      value: process.env.CDK_DEFAULT_REGION || "eu-west-1",
    });

    //* add DynamoDB as a source /
    const dynamodbDataSource = api.addDynamoDbDataSource(
      "DynamoDBDataSource",
      table
    );

    //* Queryies /
    const vtlPath = path.join(`${__dirname}`, "../mapping-templates/");

    dynamodbDataSource.createResolver("QueryGetNotesResolver", {
      typeName: "Query",
      fieldName: "getNotes",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Query.getNotes.request.vtl`)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Query.getNotes.response.vtl`)
      ),
    });

    //* Mutations /
    dynamodbDataSource.createResolver("MutationAddNoteResolver", {
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Mutation.createNote.request.vtl`)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Mutation.createNote.response.vtl`)
      ),
    });

    dynamodbDataSource.createResolver("MutationDeleteNoteResolver", {
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Mutation.deleteNote.request.vtl`)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(`${vtlPath}Mutation.deleteNote.response.vtl`)
      ),
    });
  }
}
