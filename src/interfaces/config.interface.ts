import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';

interface PartitionKey {
    name: string;
    type: dynamodb.AttributeType;
  }
  
 export  interface TableConfig {
    id: string;
    tableName: string;
    partitionKey: PartitionKey;
    additionalAttributes: string[];
    sortKey: PartitionKey | null;
  }