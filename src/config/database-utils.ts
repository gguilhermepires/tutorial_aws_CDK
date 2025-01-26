import { Construct } from 'constructs';
import { aws_dynamodb, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { TableConfig} from '../interfaces/config.interface';

export const tableConfigs:TableConfig[] = [
  {
    id: "User",
    tableName: "User", 
    partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    additionalAttributes: [
      "name",
      "dateOfBirth",
      "email",
      "password",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ], 
    sortKey: null, 
  },
  {
    id:"blogPost",
    tableName: "blogPost",
    partitionKey:{
      name:"id",
      type: dynamodb.AttributeType.STRING
    },
    additionalAttributes:[
      "title",
      "author",
      "content",
      "createdAt"
    ],
    sortKey: null
  }
];

export let databaseTables :Record<string, dynamodb.Table> = {};
export const region = 'us-east-1'
// export const databaseEndpoint = 'http://host.docker.internal:8000'
export const databaseEndpoint = 'http://localhost:4566'

export function setupDatabase(scope: Construct): Record<string, dynamodb.Table> {
  const tables: Record<string, dynamodb.Table> = {};

  tableConfigs.forEach((config:TableConfig) => {
    const configTable: any = {
      tableName: config.tableName,
      partitionKey: config.partitionKey,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Default para PAY_PER_REQUEST
    };

    
    if (config.sortKey) {
      configTable.sortKey = config.sortKey;
    }
    
    tables[config.id] = new dynamodb.Table(scope, config.id, configTable);
  });
  databaseTables = tables
  return tables;
}
