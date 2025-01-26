import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { databaseTables } from '../../config/database-utils';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = databaseTables["User"]?.tableName ;

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete user', error: error.message }),
    };
  }
};
