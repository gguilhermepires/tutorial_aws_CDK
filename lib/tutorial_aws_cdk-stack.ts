import { Stack, StackProps, App, CfnOutput } from 'aws-cdk-lib';
import { setupApiGateway } from '../src/config/api.config';
import { setupDatabase } from '../src/config/database-utils';

export class TutorialAwsCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // database 
    const databaseTables = setupDatabase(this);
   
    // API
    const api = setupApiGateway(this, databaseTables);

    // Saída do endpoint da API
    new CfnOutput(this, "ApiEndpoint", {
      value: api.url,
    });
  }
}

const app = new App();
new TutorialAwsCdkStack(app, 'TutorialAwsCdkStack');


