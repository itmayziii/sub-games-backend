import appContext from '../../shared/graphql/context'
import { Request, Response } from 'express'
import { GraphQLContext } from '../../shared/interfaces/graphql'

export default function testingContext (mockRequest: Request, mockResponse: Response): GraphQLContext {
  return appContext({ req: mockRequest, res: mockResponse })
}
