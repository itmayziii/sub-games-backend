import appContext from '../graphql/context'
import { Request, Response } from 'express'
import { GraphQLContext } from '../interfaces/graphql'

export default function testingContext (mockRequest: Request, mockResponse: Response): GraphQLContext {
  return appContext({ req: mockRequest, res: mockResponse })
}
