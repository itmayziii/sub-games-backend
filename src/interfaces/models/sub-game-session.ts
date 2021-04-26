export default interface SubGameSession {
  id: number
  ownerId: string
  isActive: boolean
  userMustVerifyEpic: boolean
  maxPlayCount: number | null
  maxActivePlayers: number
  isSubOnly: boolean
}
