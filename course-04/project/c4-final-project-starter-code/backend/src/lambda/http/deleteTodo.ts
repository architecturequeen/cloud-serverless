import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  await docClient
    .delete({
      TableName: todoTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()

  return {
    statusCode: 204,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: ''
  }
}
