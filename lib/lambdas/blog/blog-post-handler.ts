import {APIGatewayEvent}from 'aws-lambda'
import { v4 as uuid} from 'uuid'
import { BlogPost } from './BlogPost'
 import { BlogPostService } from './BlogPostService';

const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME)

export const createBlogPostHandler = async (event: APIGatewayEvent)=>{
    const partialBlogPost = JSON.parse(event.body!) as {
        title:string,
        content:string,
        author:string
    }

    const item:BlogPost ={
         id:uuid(),
        title: partialBlogPost.title,
        author: partialBlogPost.author,
        content: partialBlogPost.content,
        createdAt: new Date().toISOString()
    }

     const result = await blogPostService.saveBlogPost(item)
    return {
        statusCode:201,
        body: JSON.stringify({item, result})
    }
}

export const getBlogPostsHandler = async (event: APIGatewayEvent)=>{
  const order = event?.queryStringParameters?.order;
    let  results = await blogPostService.getBlogPosts()

    return {
        statusCode:200,
        body: JSON.stringify(results)
    }
}  

export const getBlogPostHandler = async (event: APIGatewayEvent)=>{
    const id = event?.pathParameters?.id!;
    const result = await blogPostService.getBlogPostById(id)
      return {
          statusCode:200,
          body: JSON.stringify(result)
      }
}  

export const deleteBlogPostHandler = async (event: APIGatewayEvent)=>{
    const id = event?.pathParameters?.id!;
     await blogPostService.deleteBlogPostById(id)
      return {
          statusCode:204,
          body: null
      }
}  
  