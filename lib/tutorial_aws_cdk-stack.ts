import { Stack, StackProps, App, aws_dynamodb as dynamodb, aws_lambda as lambda, aws_apigateway as apigw, CfnOutput } from 'aws-cdk-lib';
import * as path from 'path';
import { AppSettings } from '../src/config/app.settings';

export class TutorialAwsCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Criação de uma tabela no DynamoDB com nome vindo de AppSettings
    const table = new dynamodb.Table(this, "Hello", {
      partitionKey: {
        name: "name",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: AppSettings.tableName, // Usando a configuração do arquivo
    });

    // Criação de uma função Lambda
    const helloLambda = new lambda.Function(this, "HelloLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
      environment: {
        TABLE_NAME: table.tableName,
        API_PREFIX: AppSettings.apiPrefix, // Adiciona variáveis ao ambiente da Lambda
        ENVIRONMENT: AppSettings.environment,
      },
    });

    // Concedendo permissões à Lambda para acessar a tabela
    table.grantReadWriteData(helloLambda);

    // Configuração do API Gateway
    const api = new apigw.RestApi(this, "HelloApi");
    api.root.resourceForPath("hello")
    .addMethod("GET", new apigw.LambdaIntegration(helloLambda)); // Adiciona um método GET à rota

    // Saída do endpoint da API
    new CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}

const app = new App();
new TutorialAwsCdkStack(app, 'TutorialAwsCdkStack');
