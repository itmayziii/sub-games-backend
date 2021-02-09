export default interface SubGameSession {
  id: string
  ownerId: string
  isActive: boolean
  userMustVerifyEpic: boolean
  maxPlayCount?: number
  maxActivePlayers: number
  onlyAllowSubs: boolean
}
