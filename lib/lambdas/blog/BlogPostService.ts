import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { BlogPost } from "./BlogPost";

export class BlogPostService {

    private tableName:string
    private dynamo: DynamoDBClient;

    constructor(tableName:string ){
        this.tableName = tableName;
        this.dynamo = new DynamoDBClient({  })
    }

    async saveBlogPost(blogPost:BlogPost):Promise<any>{
     try{
        const params = {
            TableName: this.tableName,
            Item: marshall(blogPost, { convertClassInstanceToMap: true })
        }
        const command = new PutItemCommand(params)
        return await this.dynamo.send(command)
     }catch(err){
        return err.message  
     }
    }

    async getBlogPosts():Promise<BlogPost[]>{
        const params = {
            TableName: this.tableName,
        }
        const command = new ScanCommand(params)
        const response = await this.dynamo.send(command)
        const itens = response.Items ?? []
        return itens.map((item) => unmarshall(item) as BlogPost);
    }

    async getBlogPostById(id:string):Promise<BlogPost | null>{
        const params = {
            TableName: this.tableName,
            Key: marshall({id})
        }
        const command = new GetItemCommand(params)
        const response = await this.dynamo.send(command)
        const item = response.Item
        if(!item){
            return null
        }
        return unmarshall(item)  as BlogPost
    }

    async deleteBlogPostById(id: string) :Promise<void>{
        const params = {
            TableName: this.tableName,
            Key: marshall({id})
        }
        const command = new DeleteItemCommand(params)
         await this.dynamo.send(command)
    }
}