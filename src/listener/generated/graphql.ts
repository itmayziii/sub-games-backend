import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../shared/interfaces/graphql'
import { DeepPartial } from 'utility-types'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export interface Payload {
  complexity: Scalars['Int']
}

export type ConnectToIrcPayload = Payload & {
  __typename?: 'ConnectToIRCPayload'
  complexity: Scalars['Int']
}

export interface Query {
  __typename?: 'Query'
  connectToIRC: ConnectToIrcPayload
}

export interface QueryConnectToIrcArgs {
  userId: Scalars['ID']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export interface LegacyStitchingResolver<TResult, TParent, TContext, TArgs> {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export interface NewStitchingResolver<TResult, TParent, TContext, TArgs> {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Payload: ResolversTypes['ConnectToIRCPayload']
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']>>
  ConnectToIRCPayload: ResolverTypeWrapper<DeepPartial<ConnectToIrcPayload>>
  Query: ResolverTypeWrapper<{}>
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']>>
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']>>
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']>>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Payload: ResolversParentTypes['ConnectToIRCPayload']
  Int: DeepPartial<Scalars['Int']>
  ConnectToIRCPayload: DeepPartial<ConnectToIrcPayload>
  Query: {}
  ID: DeepPartial<Scalars['ID']>
  Boolean: DeepPartial<Scalars['Boolean']>
  String: DeepPartial<Scalars['String']>
}>

export type PayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Payload'] = ResolversParentTypes['Payload']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ConnectToIRCPayload', ParentType, ContextType>
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
}>

export type ConnectToIrcPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConnectToIRCPayload'] = ResolversParentTypes['ConnectToIRCPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  connectToIRC?: Resolver<ResolversTypes['ConnectToIRCPayload'], ParentType, ContextType, RequireFields<QueryConnectToIrcArgs, 'userId'>>
}>

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Payload?: PayloadResolvers<ContextType>
  ConnectToIRCPayload?: ConnectToIrcPayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>
