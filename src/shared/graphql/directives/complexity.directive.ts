import { SchemaDirectiveVisitor } from '@graphql-tools/utils'
import { GraphQLDirective, GraphQLField, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { createComplexityDirective } from 'graphql-query-complexity'

export default class ComplexityDirectiveVisitor extends SchemaDirectiveVisitor {
  getDirectiveDeclaration (name: string, schema: GraphQLSchema): GraphQLDirective | null | undefined {
    console.log('name', name)
    return createComplexityDirective({ name })
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  visitFieldDefinition (_field: GraphQLField<any, any>, _details: { objectType: GraphQLObjectType | GraphQLInterfaceType }): GraphQLField<any, any> | void | null {
    return super.visitFieldDefinition(_field, _details)
  }
}
