import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const params = {
    TableName: todoTable,
    Key: {
      todoId: todoId
    },
    UpdateExpression: 'SET #name = :x, dueDate = :y, done = :z',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':x': updatedTodo.name,
      ':y': updatedTodo.dueDate,
      ':z': updatedTodo.done
    }
  }
  await docClient.update(params).promise()

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ todoId, ...updatedTodo })
  }
}
