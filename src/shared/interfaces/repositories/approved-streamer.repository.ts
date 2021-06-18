import ApprovedStreamer from '../models/approved-streamer'

export default interface ApprovedStreamerRepository {
  find: (id: number) => Promise<ApprovedStreamer | undefined>
  isStreamerApproved: (userId: string) => Promise<boolean>
}
