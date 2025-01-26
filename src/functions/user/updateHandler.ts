import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { databaseTables } from '../../config/database-utils';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = databaseTables["User"]?.tableName ;

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { id } = event.pathParameters || {};
  const { name, dateOfBirth, email, password } = JSON.parse(event.body || '{}');

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #name = :name, #dateOfBirth = :dateOfBirth, #email = :email, #password = :password, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dateOfBirth': 'dateOfBirth',
      '#email': 'email',
      '#password': 'password',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':dateOfBirth': dateOfBirth,
      ':email': email,
      ':password': password,
      ':updatedAt': new Date().toISOString(),
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User updated successfully' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update user', error: error.message }),
    };
  }
};
