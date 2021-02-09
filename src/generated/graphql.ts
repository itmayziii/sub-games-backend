import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../interfaces/graphql'
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

export interface RefreshTokenInput {
  refreshToken?: Maybe<Scalars['ID']>
}

export interface RefreshTokenPayload {
  __typename?: 'RefreshTokenPayload'
  success: Scalars['Boolean']
}

export interface SubGameSession {
  __typename?: 'SubGameSession'
  id: Scalars['ID']
  owner: User
  isActive: Scalars['Boolean']
  userMustVerifyEpic: Scalars['Boolean']
  maxPlayCount?: Maybe<Scalars['Int']>
  maxActivePlayers: Scalars['Int']
  queuedPlayers: Player[]
  alreadyPlayedUsers: Player[]
  activePlayers: Player[]
  onlyAllowSubs: Scalars['Boolean']
}

export interface StartSubGameSessionInput {
  ownerId: Scalars['ID']
  userMustVerifyEpic?: Maybe<Scalars['Boolean']>
  maxPlayCount?: Maybe<Scalars['Int']>
  maxActivePlayers?: Maybe<Scalars['Int']>
  onlyAllowSubs?: Maybe<Scalars['Boolean']>
}

export interface StartSubGameSessionPayload {
  __typename?: 'StartSubGameSessionPayload'
  subGameSession: SubGameSession
}

export interface GetSubGameSessionInput {
  username: Scalars['ID']
}

export interface GetSubGameSessionPayload {
  __typename?: 'GetSubGameSessionPayload'
  subGameSession?: Maybe<SubGameSession>
}

export interface JoinSubGameSessionQueueInput {
  userId: Scalars['ID']
  sessionId: Scalars['ID']
}

export interface JoinSubGameSessionQueuePayload {
  __typename?: 'JoinSubGameSessionQueuePayload'
  subGameSession: SubGameSession
}

export interface Query {
  __typename?: 'Query'
  getSubGameSession: GetSubGameSessionPayload
}

export interface QueryGetSubGameSessionArgs {
  input: GetSubGameSessionInput
}

export interface Mutation {
  __typename?: 'Mutation'
  joinSubGameSessionQueue: JoinSubGameSessionQueuePayload
  refreshToken: RefreshTokenPayload
  startSubGameSession: StartSubGameSessionPayload
}

export interface MutationJoinSubGameSessionQueueArgs {
  input: JoinSubGameSessionQueueInput
}

export interface MutationRefreshTokenArgs {
  input?: Maybe<RefreshTokenInput>
}

export interface MutationStartSubGameSessionArgs {
  input: StartSubGameSessionInput
}

export interface UserInterface {
  id: Scalars['ID']
  username: Scalars['String']
}

export type User = UserInterface & {
  __typename?: 'User'
  id: Scalars['ID']
  username: Scalars['String']
}

export type Player = UserInterface & {
  __typename?: 'Player'
  id: Scalars['ID']
  username: Scalars['String']
  playCount: Scalars['Int']
  allTimePlayCount: Scalars['Int']
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
  RefreshTokenInput: ResolverTypeWrapper<DeepPartial<RefreshTokenInput>>
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']>>
  RefreshTokenPayload: ResolverTypeWrapper<DeepPartial<RefreshTokenPayload>>
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']>>
  SubGameSession: ResolverTypeWrapper<DeepPartial<SubGameSession>>
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']>>
  StartSubGameSessionInput: ResolverTypeWrapper<DeepPartial<StartSubGameSessionInput>>
  StartSubGameSessionPayload: ResolverTypeWrapper<DeepPartial<StartSubGameSessionPayload>>
  GetSubGameSessionInput: ResolverTypeWrapper<DeepPartial<GetSubGameSessionInput>>
  GetSubGameSessionPayload: ResolverTypeWrapper<DeepPartial<GetSubGameSessionPayload>>
  JoinSubGameSessionQueueInput: ResolverTypeWrapper<DeepPartial<JoinSubGameSessionQueueInput>>
  JoinSubGameSessionQueuePayload: ResolverTypeWrapper<DeepPartial<JoinSubGameSessionQueuePayload>>
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  UserInterface: ResolversTypes['User'] | ResolversTypes['Player']
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']>>
  User: ResolverTypeWrapper<DeepPartial<User>>
  Player: ResolverTypeWrapper<DeepPartial<Player>>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  RefreshTokenInput: DeepPartial<RefreshTokenInput>
  ID: DeepPartial<Scalars['ID']>
  RefreshTokenPayload: DeepPartial<RefreshTokenPayload>
  Boolean: DeepPartial<Scalars['Boolean']>
  SubGameSession: DeepPartial<SubGameSession>
  Int: DeepPartial<Scalars['Int']>
  StartSubGameSessionInput: DeepPartial<StartSubGameSessionInput>
  StartSubGameSessionPayload: DeepPartial<StartSubGameSessionPayload>
  GetSubGameSessionInput: DeepPartial<GetSubGameSessionInput>
  GetSubGameSessionPayload: DeepPartial<GetSubGameSessionPayload>
  JoinSubGameSessionQueueInput: DeepPartial<JoinSubGameSessionQueueInput>
  JoinSubGameSessionQueuePayload: DeepPartial<JoinSubGameSessionQueuePayload>
  Query: {}
  Mutation: {}
  UserInterface: ResolversParentTypes['User'] | ResolversParentTypes['Player']
  String: DeepPartial<Scalars['String']>
  User: DeepPartial<User>
  Player: DeepPartial<Player>
}>

export type RefreshTokenPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenPayload'] = ResolversParentTypes['RefreshTokenPayload']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SubGameSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SubGameSession'] = ResolversParentTypes['SubGameSession']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  userMustVerifyEpic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxPlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxActivePlayers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  queuedPlayers?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>
  alreadyPlayedUsers?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>
  activePlayers?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>
  onlyAllowSubs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type StartSubGameSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StartSubGameSessionPayload'] = ResolversParentTypes['StartSubGameSessionPayload']> = ResolversObject<{
  subGameSession?: Resolver<ResolversTypes['SubGameSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GetSubGameSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GetSubGameSessionPayload'] = ResolversParentTypes['GetSubGameSessionPayload']> = ResolversObject<{
  subGameSession?: Resolver<Maybe<ResolversTypes['SubGameSession']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type JoinSubGameSessionQueuePayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JoinSubGameSessionQueuePayload'] = ResolversParentTypes['JoinSubGameSessionQueuePayload']> = ResolversObject<{
  subGameSession?: Resolver<ResolversTypes['SubGameSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getSubGameSession?: Resolver<ResolversTypes['GetSubGameSessionPayload'], ParentType, ContextType, RequireFields<QueryGetSubGameSessionArgs, 'input'>>
}>

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  joinSubGameSessionQueue?: Resolver<ResolversTypes['JoinSubGameSessionQueuePayload'], ParentType, ContextType, RequireFields<MutationJoinSubGameSessionQueueArgs, 'input'>>
  refreshToken?: Resolver<ResolversTypes['RefreshTokenPayload'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, never>>
  startSubGameSession?: Resolver<ResolversTypes['StartSubGameSessionPayload'], ParentType, ContextType, RequireFields<MutationStartSubGameSessionArgs, 'input'>>
}>

export type UserInterfaceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserInterface'] = ResolversParentTypes['UserInterface']> = ResolversObject<{
  __resolveType: TypeResolveFn<'User' | 'Player', ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PlayerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  playCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  allTimePlayCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  RefreshTokenPayload?: RefreshTokenPayloadResolvers<ContextType>
  SubGameSession?: SubGameSessionResolvers<ContextType>
  StartSubGameSessionPayload?: StartSubGameSessionPayloadResolvers<ContextType>
  GetSubGameSessionPayload?: GetSubGameSessionPayloadResolvers<ContextType>
  JoinSubGameSessionQueuePayload?: JoinSubGameSessionQueuePayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  UserInterface?: UserInterfaceResolvers<ContextType>
  User?: UserResolvers<ContextType>
  Player?: PlayerResolvers<ContextType>
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>
