import { Construct } from 'constructs';
import { aws_lambda as lambda,
  aws_lambda_nodejs,
  aws_apigateway as apigw, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import * as path from 'path';
import { AppSettings } from './app.settings';

export function setupApiGateway(
  scope: Construct,
  tables: Record<string, dynamodb.Table>
): apigw.RestApi {
  const apiId ='HelloApi'
  
  const api = new apigw.RestApi(scope, apiId);


  const createBlogPostLambdaName='createBlogPostHandler';
  const  createBlogPostLambda = new aws_lambda_nodejs.NodejsFunction(
    scope,
    createBlogPostLambdaName,
  {
    entry:'lib/lambdas/blog/blog-post-handler.ts',
    handler: createBlogPostLambdaName,
    functionName:createBlogPostLambdaName,
    environment: {
      TABLE_NAME: tables["blogPost"].tableName
    }
  });
  const blogPostPath = api.root.addResource("blogpost");
  blogPostPath.addMethod("POST",
    new apigw.LambdaIntegration(createBlogPostLambda)
  )

  tables["blogPost"].grantReadWriteData(createBlogPostLambda);

  // GET ALL  
  const getBlogPostsLambdaName = 'getBlogPostsHandler'
  const getBlogPostsLambda= new aws_lambda_nodejs.NodejsFunction(
    scope,
    getBlogPostsLambdaName,
  {
    entry:'lib/lambdas/blog/blog-post-handler.ts',
    handler: getBlogPostsLambdaName,
    functionName:getBlogPostsLambdaName,
    environment: {
      TABLE_NAME: tables["blogPost"].tableName
    }
  });
  tables["blogPost"].grantReadData(getBlogPostsLambda);
  blogPostPath.addMethod("GET",
    new apigw.LambdaIntegration(getBlogPostsLambda), 
    {
      requestParameters: {
        "method.request.querystring.order":false
      }
    }
  )

   // GET one  
   const getBlogPostLambdaName = 'getBlogPostHandler'
   const getBlogPostLambda= new aws_lambda_nodejs.NodejsFunction(
     scope,
     getBlogPostLambdaName,
   {
     entry:'lib/lambdas/blog/blog-post-handler.ts',
     handler: getBlogPostLambdaName,
     functionName:getBlogPostLambdaName,
     environment: {
       TABLE_NAME: tables["blogPost"].tableName
     }
   });
   tables["blogPost"].grantReadData(getBlogPostLambda);
   const getBlogPostByIdPath = blogPostPath.addResource("{id}")
   getBlogPostByIdPath.addMethod("GET",
     new apigw.LambdaIntegration(getBlogPostLambda), 
     {
       requestParameters: {
         "method.request.querystring.order":false
       }
     }
   )

   // delete one
   const deleteBlogPostLambdaName = 'deleteBlogPostHandler'
   const deleteBlogPostLamda = new aws_lambda_nodejs.NodejsFunction(
    scope,
    deleteBlogPostLambdaName,
    {
      entry:'lib/lambdas/blog/blog-post-handler.ts',
      handler: deleteBlogPostLambdaName,
      functionName:deleteBlogPostLambdaName,
      environment: {
        TABLE_NAME: tables["blogPost"].tableName
      }
    }
  );
  tables["blogPost"].grantReadWriteData(deleteBlogPostLamda)
  getBlogPostByIdPath.addMethod(
    "DELETE",
    new apigw.LambdaIntegration(deleteBlogPostLamda), 
  )

  // Configuração das Lambdas e rotas
  // const routes = [

    
  //   {
  //     path: "users",
  //     method: "POST",
  //     lambdaConfig: {
  //       id: "CreateUser",
  //       handler: "users.createHandler",
  //       codePath: path.join(__dirname, "../dist"),
  //       environment: {
  //         TABLE_NAME: tables["User"]?.tableName || "",
  //         API_PREFIX: AppSettings.apiPrefix,
  //         ENVIRONMENT: AppSettings.environment,
  //       },
  //     },
  //   },
  //   {
  //     path: "users/{id}",
  //     method: "GET", 
  //     lambdaConfig: {
  //       id: "GetUser",
  //       handler: "users.getHandler", 
  //       codePath: path.join(__dirname, "../dist"),
  //       environment: {
  //         TABLE_NAME: tables["User"]?.tableName || "",
  //         API_PREFIX: AppSettings.apiPrefix,
  //         ENVIRONMENT: AppSettings.environment,
  //       },
  //     },
  //   },
  //   {
  //     path: "users/{id}",
  //     method: "PUT",
  //     lambdaConfig: {
  //       id: "UpdateUser",
  //       handler: "users.updateHandler", 
  //       codePath: path.join(__dirname, "../dist"),
  //       environment: {
  //         TABLE_NAME: tables["User"]?.tableName || "",
  //         API_PREFIX: AppSettings.apiPrefix,
  //         ENVIRONMENT: AppSettings.environment,
  //       },
  //     },
  //   },
  //   {
  //     path: "users/{id}",
  //     method: "DELETE", 
  //     lambdaConfig: {
  //       id: "DeleteUser",
  //       handler: "users.deleteHandler", 
  //       codePath: path.join(__dirname, "../dist"),
  //       environment: {
  //         TABLE_NAME: tables["User"]?.tableName || "",
  //         API_PREFIX: AppSettings.apiPrefix,
  //         ENVIRONMENT: AppSettings.environment,
  //       },
  //     },
  //   },
  // ];

  // Criação de Lambdas e associação com as rotas
  // routes.forEach((route) => {
  //   const routeLambda = new lambda.Function(scope, route.lambdaConfig.id, {
  //     runtime: lambda.Runtime.NODEJS_20_X,
  //     handler: route.lambdaConfig.handler,
  //     code: lambda.Code.fromAsset(path.resolve(route.lambdaConfig.codePath)),
  //     environment: route.lambdaConfig.environment,
  //   });

  //   // Concedendo permissões de leitura/escrita à Lambda
  //   Object.values(tables).forEach((table) => table.grantReadWriteData(routeLambda));

  //   // Adicionando o método e integração ao API Gateway
  //   const resource = api.root.resourceForPath(route.path);
  //   resource.addMethod(route.method, new apigw.LambdaIntegration(routeLambda));
  // });

  return api;
}
