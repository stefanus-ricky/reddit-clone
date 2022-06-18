
const  { DynamoDBDocumentClient, PutCommand, GetCommand  }  = require("@aws-sdk/lib-dynamodb");
const  { ddbClient }  = require("./ddbClient.js");
// var AWS = require('aws-sdk');
// AWS.config.update({
//   region: 'us-west-2',
// //   endpoint: "http://localhost:8000",
//   accessKeyId: process.env.DYNAMODB_KEY_ID,
//   secretAccessKey: process.env.DYNAMODB_ACESS_KEY,
// });
// import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
// import { ddbClient } from "./ddbClient.js";

// import { PutCommand } from "@aws-sdk/lib-dynamodb";
// import { GetCommand } from "@aws-sdk/lib-dynamodb";


const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

const putItem = async ({tableName, item}) => {
    // Set the parameters.
    const params = {
        TableName: tableName,
        Item: item,
    };
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        return data
    } catch (err) {
        console.log("Error", err.stack);
    }
};


  
const getItem = async ({tableName, key}) => {
    // Set the parameters.
    const params = {
        TableName: tableName,
        Key: key
        // {
        // primaryKey: "VALUE_1",
        // sortKey: "VALUE_2",
        // },
    };
    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      console.log("Success :", data.Item);
      return data
    } catch (err) {
      console.log("Error", err);
    }
};


// export { ddbDocClient };
module.exports = {getItem, putItem, ddbDocClient}