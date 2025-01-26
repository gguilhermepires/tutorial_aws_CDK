import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { databaseTables, databaseEndpoint, region} from '../../config/database-utils';

export const getHandler = async (event: APIGatewayEvent, context: Context) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  const getParams = {
    TableName: databaseTables["User"]?.tableName ,
    Key: {
      id: { S: id },
    },
  };

  try {
    const client = new DynamoDBClient({
      region, 
      endpoint: databaseEndpoint
    });

    const getCommand = new GetItemCommand(getParams);
    const result = await client.send(getCommand);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch user', error: error.message }),
    };
  }
};
