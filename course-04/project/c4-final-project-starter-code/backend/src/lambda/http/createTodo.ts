import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const newTodo = {
    todoId,
    ...parsedBody
  }

  await docClient.put({ TableName: todoTable, Item: newTodo }).promise()

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ newTodo })
  }
}
