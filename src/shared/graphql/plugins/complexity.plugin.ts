import { PluginDefinition } from 'apollo-server-core'
import { directiveEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity'
import { GraphQLSchema, separateOperations } from 'graphql'
import Logger from '../../interfaces/logger'

/**
 * Calculates query complexity and adds it to "complexity" field on the payload.
 */
export default function ComplexityPlugin (schema: GraphQLSchema, logger: Logger): PluginDefinition {
  return {
    requestDidStart (requestContext) {
      let complexity: number | null = null
      return {
        didResolveOperation ({ request, document }) {
          complexity = getComplexity({
            schema,
            query: request.operationName === undefined
              ? document
              : separateOperations(document)[request.operationName],
            variables: request.variables,
            estimators: [
              directiveEstimator({ name: 'complexity' }),
              simpleEstimator({ defaultComplexity: 1 }) // Every field gets a default value
            ]
          })

          const maxComplexity = 1000
          if (complexity >= maxComplexity) {
            throw new Error(`Sorry, your query was too complicated, ${complexity} is over the max complexity of ${maxComplexity}.`)
          }

          logger.debug(`Query Complexity - ${request.operationName ?? 'Unknown operation'} - ${complexity}`)
        },
        executionDidStart (executionRequestContext) {
          return {
            willResolveField ({ source, args, context, info }) {
              if (info.fieldName === 'complexity') {
                source.complexity = complexity
              }
            }
          }
        }
      }
    }
  }
}
