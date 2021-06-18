import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
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
  maxPlayCount_Int_min_0_max_1000: any
  maxActivePlayers_Int_min_0_max_1000: any
  order_Int_NotNull_max_5000: any
  refreshToken_String_maxLength_255: any
  first_Int_min_0: any
}

export interface SessionEdge {
  __typename?: 'SessionEdge'
  node: Session
  /**
   * This cursor is not spec compliant - https://relay.dev/graphql/connections.htm#sec-Cursor. Instead this cursor will be
   * the same for every edge and can be used to retrieve the next set of results. This difference from the spec is due to
   * the limitations of the Twitch API.
   */
  cursor?: Maybe<Scalars['String']>
}

export type SessionsConnection = Payload & {
  __typename?: 'SessionsConnection'
  complexity: Scalars['Int']
  edges: SessionEdge[]
  pageInfo: PageInfo
}

export interface JoinSubGameSessionQueueInput {
  userId: Scalars['ID']
  subGameSessionId: Scalars['ID']
}

export interface ActiveSubGameSessionByUserIdInput {
  userId: Scalars['ID']
}

export interface SubGameSessionByIdInput {
  id: Scalars['ID']
}

export interface StartSubGameSessionInput {
  ownerId: Scalars['ID']
  userMustVerifyEpic?: Maybe<Scalars['Boolean']>
  maxPlayCount?: Maybe<Scalars['maxPlayCount_Int_min_0_max_1000']>
  maxActivePlayers?: Maybe<Scalars['maxActivePlayers_Int_min_0_max_1000']>
  isSubOnly?: Maybe<Scalars['Boolean']>
}

export interface ActiveSubGameSessionByUsernameInput {
  /** This "username" input is case sensitive and refers to a users Twitch "dipslay_name" not their "login" name. https://dev.twitch.tv/docs/api/reference#get-users */
  username: Scalars['ID']
}

export interface MovePlayerQueueOrderInput {
  userId: Scalars['ID']
  order: Scalars['order_Int_NotNull_max_5000']
  subGameSessionId: Scalars['ID']
}

export interface RefreshTokenInput {
  refreshToken?: Maybe<Scalars['refreshToken_String_maxLength_255']>
}

/** https://relay.dev/graphql/connections.htm#sec-Arguments */
export interface SessionsByUserIdInput {
  userId: Scalars['ID']
  /** https://relay.dev/graphql/connections.htm#sec-Forward-pagination-arguments */
  first?: Maybe<Scalars['first_Int_min_0']>
  after?: Maybe<Scalars['String']>
}

export interface UserInterface {
  id: Scalars['ID']
  username: Scalars['String']
}

export interface PlayerInterface {
  id: Scalars['ID']
  username: Scalars['String']
  playCount: Scalars['Int']
  allTimePlayCount: Scalars['Int']
}

export interface Node {
  /**
   * https://relay.dev/docs/guides/graphql-server-specification/
   * https://relay.dev/graphql/objectidentification.htm#sec-Node-Interface
   */
  id: Scalars['ID']
}

export interface Payload {
  complexity: Scalars['Int']
}

export type RefreshTokenPayload = Payload & {
  __typename?: 'RefreshTokenPayload'
  complexity: Scalars['Int']
  success: Scalars['Boolean']
}

export type StartSubGameSessionPayload = Payload & {
  __typename?: 'StartSubGameSessionPayload'
  complexity: Scalars['Int']
  subGameSession: SubGameSession
}

export type ActiveSubGameSessionByUsernamePayload = Payload & {
  __typename?: 'ActiveSubGameSessionByUsernamePayload'
  complexity: Scalars['Int']
  subGameSession?: Maybe<SubGameSession>
}

export type SubGameSessionByIdPayload = Payload & {
  __typename?: 'SubGameSessionByIdPayload'
  complexity: Scalars['Int']
  subGameSession?: Maybe<SubGameSession>
}

export type ActiveSubGameSessionByUserIdPayload = Payload & {
  __typename?: 'ActiveSubGameSessionByUserIdPayload'
  complexity: Scalars['Int']
  subGameSession?: Maybe<SubGameSession>
}

export type JoinSubGameSessionQueuePayload = Payload & {
  __typename?: 'JoinSubGameSessionQueuePayload'
  complexity: Scalars['Int']
  subGameSession: SubGameSession
}

export type MovePlayerQueueOrderPayload = Payload & {
  __typename?: 'MovePlayerQueueOrderPayload'
  complexity: Scalars['Int']
  subGameSession: SubGameSession
}

export interface Query {
  __typename?: 'Query'
  /** https://relay.dev/graphql/objectidentification.htm#sec-Node-Interface */
  node?: Maybe<Node>
  sessionsByUserId: SessionsConnection
  activeSubGameSessionByUsername: ActiveSubGameSessionByUsernamePayload
  activeSubGameSessionByUserId: ActiveSubGameSessionByUserIdPayload
  subGameSessionById: SubGameSessionByIdPayload
}

export interface QueryNodeArgs {
  id: Scalars['ID']
}

export interface QuerySessionsByUserIdArgs {
  input: SessionsByUserIdInput
}

export interface QueryActiveSubGameSessionByUsernameArgs {
  input: ActiveSubGameSessionByUsernameInput
}

export interface QueryActiveSubGameSessionByUserIdArgs {
  input: ActiveSubGameSessionByUserIdInput
}

export interface QuerySubGameSessionByIdArgs {
  input: SubGameSessionByIdInput
}

export interface Mutation {
  __typename?: 'Mutation'
  joinSubGameSessionQueue: JoinSubGameSessionQueuePayload
  refreshToken: RefreshTokenPayload
  startSubGameSession: StartSubGameSessionPayload
  movePlayerQueueOrder: MovePlayerQueueOrderPayload
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

export interface MutationMovePlayerQueueOrderArgs {
  input: MovePlayerQueueOrderInput
}

/** https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo */
export interface PageInfo {
  __typename?: 'PageInfo'
  hasPreviousPage: Scalars['Boolean']
  hasNextPage: Scalars['Boolean']
  startCursor: Scalars['String']
  endCursor: Scalars['String']
}

export type Session = Node & {
  __typename?: 'Session'
  id: Scalars['ID']
  /** Last sub game session which may be be active or inactive. */
  subGameSession?: Maybe<SubGameSession>
  /** Currently active Twitch stream. */
  twitchSession: TwitchSession
}

export interface TwitchSession {
  __typename?: 'TwitchSession'
  user: User
  gameName: Scalars['String']
  viewerCount: Scalars['Int']
  thumbnailURL: Scalars['String']
}

export type SubGameSession = Node & {
  __typename?: 'SubGameSession'
  id: Scalars['ID']
  owner: User
  isActive: Scalars['Boolean']
  userMustVerifyEpic: Scalars['Boolean']
  maxPlayCount?: Maybe<Scalars['Int']>
  maxActivePlayers: Scalars['Int']
  queuedPlayers: QueuedPlayer[]
  alreadyPlayedUsers: Player[]
  activePlayers: Player[]
  isSubOnly: Scalars['Boolean']
}

export type User = UserInterface & Node & {
  __typename?: 'User'
  id: Scalars['ID']
  username: Scalars['String']
}

export type Player = UserInterface & PlayerInterface & Node & {
  __typename?: 'Player'
  id: Scalars['ID']
  username: Scalars['String']
  playCount: Scalars['Int']
  allTimePlayCount: Scalars['Int']
}

export type QueuedPlayer = UserInterface & PlayerInterface & Node & {
  __typename?: 'QueuedPlayer'
  id: Scalars['ID']
  username: Scalars['String']
  playCount: Scalars['Int']
  allTimePlayCount: Scalars['Int']
  order: Scalars['Int']
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
  SessionEdge: ResolverTypeWrapper<DeepPartial<SessionEdge>>
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']>>
  SessionsConnection: ResolverTypeWrapper<DeepPartial<SessionsConnection>>
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']>>
  JoinSubGameSessionQueueInput: ResolverTypeWrapper<DeepPartial<JoinSubGameSessionQueueInput>>
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']>>
  ActiveSubGameSessionByUserIdInput: ResolverTypeWrapper<DeepPartial<ActiveSubGameSessionByUserIdInput>>
  SubGameSessionByIdInput: ResolverTypeWrapper<DeepPartial<SubGameSessionByIdInput>>
  StartSubGameSessionInput: ResolverTypeWrapper<DeepPartial<StartSubGameSessionInput>>
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']>>
  ActiveSubGameSessionByUsernameInput: ResolverTypeWrapper<DeepPartial<ActiveSubGameSessionByUsernameInput>>
  MovePlayerQueueOrderInput: ResolverTypeWrapper<DeepPartial<MovePlayerQueueOrderInput>>
  RefreshTokenInput: ResolverTypeWrapper<DeepPartial<RefreshTokenInput>>
  SessionsByUserIdInput: ResolverTypeWrapper<DeepPartial<SessionsByUserIdInput>>
  UserInterface: ResolversTypes['User'] | ResolversTypes['Player'] | ResolversTypes['QueuedPlayer']
  PlayerInterface: ResolversTypes['Player'] | ResolversTypes['QueuedPlayer']
  Node: ResolversTypes['Session'] | ResolversTypes['SubGameSession'] | ResolversTypes['User'] | ResolversTypes['Player'] | ResolversTypes['QueuedPlayer']
  Payload: ResolversTypes['SessionsConnection'] | ResolversTypes['RefreshTokenPayload'] | ResolversTypes['StartSubGameSessionPayload'] | ResolversTypes['ActiveSubGameSessionByUsernamePayload'] | ResolversTypes['SubGameSessionByIdPayload'] | ResolversTypes['ActiveSubGameSessionByUserIdPayload'] | ResolversTypes['JoinSubGameSessionQueuePayload'] | ResolversTypes['MovePlayerQueueOrderPayload']
  RefreshTokenPayload: ResolverTypeWrapper<DeepPartial<RefreshTokenPayload>>
  StartSubGameSessionPayload: ResolverTypeWrapper<DeepPartial<StartSubGameSessionPayload>>
  ActiveSubGameSessionByUsernamePayload: ResolverTypeWrapper<DeepPartial<ActiveSubGameSessionByUsernamePayload>>
  SubGameSessionByIdPayload: ResolverTypeWrapper<DeepPartial<SubGameSessionByIdPayload>>
  ActiveSubGameSessionByUserIdPayload: ResolverTypeWrapper<DeepPartial<ActiveSubGameSessionByUserIdPayload>>
  JoinSubGameSessionQueuePayload: ResolverTypeWrapper<DeepPartial<JoinSubGameSessionQueuePayload>>
  MovePlayerQueueOrderPayload: ResolverTypeWrapper<DeepPartial<MovePlayerQueueOrderPayload>>
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  PageInfo: ResolverTypeWrapper<DeepPartial<PageInfo>>
  Session: ResolverTypeWrapper<DeepPartial<Session>>
  TwitchSession: ResolverTypeWrapper<DeepPartial<TwitchSession>>
  SubGameSession: ResolverTypeWrapper<DeepPartial<SubGameSession>>
  User: ResolverTypeWrapper<DeepPartial<User>>
  Player: ResolverTypeWrapper<DeepPartial<Player>>
  QueuedPlayer: ResolverTypeWrapper<DeepPartial<QueuedPlayer>>
  maxPlayCount_Int_min_0_max_1000: ResolverTypeWrapper<DeepPartial<Scalars['maxPlayCount_Int_min_0_max_1000']>>
  maxActivePlayers_Int_min_0_max_1000: ResolverTypeWrapper<DeepPartial<Scalars['maxActivePlayers_Int_min_0_max_1000']>>
  order_Int_NotNull_max_5000: ResolverTypeWrapper<DeepPartial<Scalars['order_Int_NotNull_max_5000']>>
  refreshToken_String_maxLength_255: ResolverTypeWrapper<DeepPartial<Scalars['refreshToken_String_maxLength_255']>>
  first_Int_min_0: ResolverTypeWrapper<DeepPartial<Scalars['first_Int_min_0']>>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  SessionEdge: DeepPartial<SessionEdge>
  String: DeepPartial<Scalars['String']>
  SessionsConnection: DeepPartial<SessionsConnection>
  Int: DeepPartial<Scalars['Int']>
  JoinSubGameSessionQueueInput: DeepPartial<JoinSubGameSessionQueueInput>
  ID: DeepPartial<Scalars['ID']>
  ActiveSubGameSessionByUserIdInput: DeepPartial<ActiveSubGameSessionByUserIdInput>
  SubGameSessionByIdInput: DeepPartial<SubGameSessionByIdInput>
  StartSubGameSessionInput: DeepPartial<StartSubGameSessionInput>
  Boolean: DeepPartial<Scalars['Boolean']>
  ActiveSubGameSessionByUsernameInput: DeepPartial<ActiveSubGameSessionByUsernameInput>
  MovePlayerQueueOrderInput: DeepPartial<MovePlayerQueueOrderInput>
  RefreshTokenInput: DeepPartial<RefreshTokenInput>
  SessionsByUserIdInput: DeepPartial<SessionsByUserIdInput>
  UserInterface: ResolversParentTypes['User'] | ResolversParentTypes['Player'] | ResolversParentTypes['QueuedPlayer']
  PlayerInterface: ResolversParentTypes['Player'] | ResolversParentTypes['QueuedPlayer']
  Node: ResolversParentTypes['Session'] | ResolversParentTypes['SubGameSession'] | ResolversParentTypes['User'] | ResolversParentTypes['Player'] | ResolversParentTypes['QueuedPlayer']
  Payload: ResolversParentTypes['SessionsConnection'] | ResolversParentTypes['RefreshTokenPayload'] | ResolversParentTypes['StartSubGameSessionPayload'] | ResolversParentTypes['ActiveSubGameSessionByUsernamePayload'] | ResolversParentTypes['SubGameSessionByIdPayload'] | ResolversParentTypes['ActiveSubGameSessionByUserIdPayload'] | ResolversParentTypes['JoinSubGameSessionQueuePayload'] | ResolversParentTypes['MovePlayerQueueOrderPayload']
  RefreshTokenPayload: DeepPartial<RefreshTokenPayload>
  StartSubGameSessionPayload: DeepPartial<StartSubGameSessionPayload>
  ActiveSubGameSessionByUsernamePayload: DeepPartial<ActiveSubGameSessionByUsernamePayload>
  SubGameSessionByIdPayload: DeepPartial<SubGameSessionByIdPayload>
  ActiveSubGameSessionByUserIdPayload: DeepPartial<ActiveSubGameSessionByUserIdPayload>
  JoinSubGameSessionQueuePayload: DeepPartial<JoinSubGameSessionQueuePayload>
  MovePlayerQueueOrderPayload: DeepPartial<MovePlayerQueueOrderPayload>
  Query: {}
  Mutation: {}
  PageInfo: DeepPartial<PageInfo>
  Session: DeepPartial<Session>
  TwitchSession: DeepPartial<TwitchSession>
  SubGameSession: DeepPartial<SubGameSession>
  User: DeepPartial<User>
  Player: DeepPartial<Player>
  QueuedPlayer: DeepPartial<QueuedPlayer>
  maxPlayCount_Int_min_0_max_1000: DeepPartial<Scalars['maxPlayCount_Int_min_0_max_1000']>
  maxActivePlayers_Int_min_0_max_1000: DeepPartial<Scalars['maxActivePlayers_Int_min_0_max_1000']>
  order_Int_NotNull_max_5000: DeepPartial<Scalars['order_Int_NotNull_max_5000']>
  refreshToken_String_maxLength_255: DeepPartial<Scalars['refreshToken_String_maxLength_255']>
  first_Int_min_0: DeepPartial<Scalars['first_Int_min_0']>
}>

export interface ComplexityDirectiveArgs {
  value: Scalars['Int']
  multipliers?: Maybe<Array<Scalars['String']>>
}

export type ComplexityDirectiveResolver<Result, Parent, ContextType = GraphQLContext, Args = ComplexityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export interface ConstraintDirectiveArgs {
  minLength?: Maybe<Scalars['Int']>
  maxLength?: Maybe<Scalars['Int']>
  startsWith?: Maybe<Scalars['String']>
  endsWith?: Maybe<Scalars['String']>
  contains?: Maybe<Scalars['String']>
  notContains?: Maybe<Scalars['String']>
  pattern?: Maybe<Scalars['String']>
  format?: Maybe<Scalars['String']>
  min?: Maybe<Scalars['Int']>
  max?: Maybe<Scalars['Int']>
  exclusiveMin?: Maybe<Scalars['Int']>
  exclusiveMax?: Maybe<Scalars['Int']>
  multipleOf?: Maybe<Scalars['Int']>
}

export type ConstraintDirectiveResolver<Result, Parent, ContextType = GraphQLContext, Args = ConstraintDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type SessionEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionEdge'] = ResolversParentTypes['SessionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Session'], ParentType, ContextType>
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SessionsConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionsConnection'] = ResolversParentTypes['SessionsConnection']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  edges?: Resolver<Array<ResolversTypes['SessionEdge']>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UserInterfaceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserInterface'] = ResolversParentTypes['UserInterface']> = ResolversObject<{
  __resolveType: TypeResolveFn<'User' | 'Player' | 'QueuedPlayer', ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type PlayerInterfaceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PlayerInterface'] = ResolversParentTypes['PlayerInterface']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Player' | 'QueuedPlayer', ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  playCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  allTimePlayCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
}>

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Session' | 'SubGameSession' | 'User' | 'Player' | 'QueuedPlayer', ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
}>

export type PayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Payload'] = ResolversParentTypes['Payload']> = ResolversObject<{
  __resolveType: TypeResolveFn<'SessionsConnection' | 'RefreshTokenPayload' | 'StartSubGameSessionPayload' | 'ActiveSubGameSessionByUsernamePayload' | 'SubGameSessionByIdPayload' | 'ActiveSubGameSessionByUserIdPayload' | 'JoinSubGameSessionQueuePayload' | 'MovePlayerQueueOrderPayload', ParentType, ContextType>
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
}>

export type RefreshTokenPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenPayload'] = ResolversParentTypes['RefreshTokenPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type StartSubGameSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StartSubGameSessionPayload'] = ResolversParentTypes['StartSubGameSessionPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<ResolversTypes['SubGameSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ActiveSubGameSessionByUsernamePayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActiveSubGameSessionByUsernamePayload'] = ResolversParentTypes['ActiveSubGameSessionByUsernamePayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<Maybe<ResolversTypes['SubGameSession']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SubGameSessionByIdPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SubGameSessionByIdPayload'] = ResolversParentTypes['SubGameSessionByIdPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<Maybe<ResolversTypes['SubGameSession']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ActiveSubGameSessionByUserIdPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActiveSubGameSessionByUserIdPayload'] = ResolversParentTypes['ActiveSubGameSessionByUserIdPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<Maybe<ResolversTypes['SubGameSession']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type JoinSubGameSessionQueuePayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JoinSubGameSessionQueuePayload'] = ResolversParentTypes['JoinSubGameSessionQueuePayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<ResolversTypes['SubGameSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type MovePlayerQueueOrderPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MovePlayerQueueOrderPayload'] = ResolversParentTypes['MovePlayerQueueOrderPayload']> = ResolversObject<{
  complexity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  subGameSession?: Resolver<ResolversTypes['SubGameSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>
  sessionsByUserId?: Resolver<ResolversTypes['SessionsConnection'], ParentType, ContextType, RequireFields<QuerySessionsByUserIdArgs, 'input'>>
  activeSubGameSessionByUsername?: Resolver<ResolversTypes['ActiveSubGameSessionByUsernamePayload'], ParentType, ContextType, RequireFields<QueryActiveSubGameSessionByUsernameArgs, 'input'>>
  activeSubGameSessionByUserId?: Resolver<ResolversTypes['ActiveSubGameSessionByUserIdPayload'], ParentType, ContextType, RequireFields<QueryActiveSubGameSessionByUserIdArgs, 'input'>>
  subGameSessionById?: Resolver<ResolversTypes['SubGameSessionByIdPayload'], ParentType, ContextType, RequireFields<QuerySubGameSessionByIdArgs, 'input'>>
}>

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  joinSubGameSessionQueue?: Resolver<ResolversTypes['JoinSubGameSessionQueuePayload'], ParentType, ContextType, RequireFields<MutationJoinSubGameSessionQueueArgs, 'input'>>
  refreshToken?: Resolver<ResolversTypes['RefreshTokenPayload'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, never>>
  startSubGameSession?: Resolver<ResolversTypes['StartSubGameSessionPayload'], ParentType, ContextType, RequireFields<MutationStartSubGameSessionArgs, 'input'>>
  movePlayerQueueOrder?: Resolver<ResolversTypes['MovePlayerQueueOrderPayload'], ParentType, ContextType, RequireFields<MutationMovePlayerQueueOrderArgs, 'input'>>
}>

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  startCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  subGameSession?: Resolver<Maybe<ResolversTypes['SubGameSession']>, ParentType, ContextType>
  twitchSession?: Resolver<ResolversTypes['TwitchSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type TwitchSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TwitchSession'] = ResolversParentTypes['TwitchSession']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  gameName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  viewerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  thumbnailURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SubGameSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SubGameSession'] = ResolversParentTypes['SubGameSession']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  userMustVerifyEpic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxPlayCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxActivePlayers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  queuedPlayers?: Resolver<Array<ResolversTypes['QueuedPlayer']>, ParentType, ContextType>
  alreadyPlayedUsers?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>
  activePlayers?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>
  isSubOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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

export type QueuedPlayerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QueuedPlayer'] = ResolversParentTypes['QueuedPlayer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  playCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  allTimePlayCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface MaxPlayCount_Int_Min_0_Max_1000ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['maxPlayCount_Int_min_0_max_1000'], any> {
  name: 'maxPlayCount_Int_min_0_max_1000'
}

export interface MaxActivePlayers_Int_Min_0_Max_1000ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['maxActivePlayers_Int_min_0_max_1000'], any> {
  name: 'maxActivePlayers_Int_min_0_max_1000'
}

export interface Order_Int_NotNull_Max_5000ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['order_Int_NotNull_max_5000'], any> {
  name: 'order_Int_NotNull_max_5000'
}

export interface RefreshToken_String_MaxLength_255ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['refreshToken_String_maxLength_255'], any> {
  name: 'refreshToken_String_maxLength_255'
}

export interface First_Int_Min_0ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['first_Int_min_0'], any> {
  name: 'first_Int_min_0'
}

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  SessionEdge?: SessionEdgeResolvers<ContextType>
  SessionsConnection?: SessionsConnectionResolvers<ContextType>
  UserInterface?: UserInterfaceResolvers<ContextType>
  PlayerInterface?: PlayerInterfaceResolvers<ContextType>
  Node?: NodeResolvers<ContextType>
  Payload?: PayloadResolvers<ContextType>
  RefreshTokenPayload?: RefreshTokenPayloadResolvers<ContextType>
  StartSubGameSessionPayload?: StartSubGameSessionPayloadResolvers<ContextType>
  ActiveSubGameSessionByUsernamePayload?: ActiveSubGameSessionByUsernamePayloadResolvers<ContextType>
  SubGameSessionByIdPayload?: SubGameSessionByIdPayloadResolvers<ContextType>
  ActiveSubGameSessionByUserIdPayload?: ActiveSubGameSessionByUserIdPayloadResolvers<ContextType>
  JoinSubGameSessionQueuePayload?: JoinSubGameSessionQueuePayloadResolvers<ContextType>
  MovePlayerQueueOrderPayload?: MovePlayerQueueOrderPayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Session?: SessionResolvers<ContextType>
  TwitchSession?: TwitchSessionResolvers<ContextType>
  SubGameSession?: SubGameSessionResolvers<ContextType>
  User?: UserResolvers<ContextType>
  Player?: PlayerResolvers<ContextType>
  QueuedPlayer?: QueuedPlayerResolvers<ContextType>
  maxPlayCount_Int_min_0_max_1000?: GraphQLScalarType
  maxActivePlayers_Int_min_0_max_1000?: GraphQLScalarType
  order_Int_NotNull_max_5000?: GraphQLScalarType
  refreshToken_String_maxLength_255?: GraphQLScalarType
  first_Int_min_0?: GraphQLScalarType
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>
export type DirectiveResolvers<ContextType = GraphQLContext> = ResolversObject<{
  complexity?: ComplexityDirectiveResolver<any, any, ContextType>
  constraint?: ConstraintDirectiveResolver<any, any, ContextType>
}>

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = GraphQLContext> = DirectiveResolvers<ContextType>
