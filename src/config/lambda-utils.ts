import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
interface CreateLambdaProps {
  tableName: string;
  apiPrefix: string;
  environment: string;
  codePath: string;
}

export function createHelloLambda(scope: Construct, id: string, props: CreateLambdaProps): lambda.Function {
  return new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: "index.handler",
    code: lambda.Code.fromAsset(props.codePath),
    environment: {
      TABLE_NAME: props.tableName,
      API_PREFIX: props.apiPrefix,
      ENVIRONMENT: props.environment,
    },
  });
}