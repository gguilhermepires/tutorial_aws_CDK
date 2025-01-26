import { APIGatewayEvent ,Context} from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { databaseTables } from '../../config/database-utils';

const dynamoDBClient = new DynamoDBClient({});


export const handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    console.log('linha 10')
    const { name, email, password, id } = JSON.parse(event.body || '{}');

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    const params = {
      TableName: databaseTables["User"]?.tableName ,
      Item: {
        id: { S: id },
        name: { S: name },
        email: { S: email },
        password: { S: password },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    };
console.log('linha 30')
    await dynamoDBClient.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully', id }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create user', error: error.message }),
    };
  }
};
