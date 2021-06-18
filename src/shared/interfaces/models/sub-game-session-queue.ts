export default interface SubGameSessionQueue {
  id: number
  subGameSessionId: number
  userId: string
  order: number
  joinedAt: Date
}
