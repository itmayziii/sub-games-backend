import * as Knex from 'knex'
import ApprovedStreamer from "../interfaces/approved-streamer";

export default function ApprovedStreamerRepository (db: Knex) {
  return {
    find(id: string): Promise<ApprovedStreamer | undefined> {
      return db.first<ApprovedStreamer>().from('approvedStreamer').where({ id })
        .then(result => result)
    },
    isStreamerApproved (userId: string): Promise<boolean> {
      return db('approvedStreamer').count<{ count: number }[]>('id').where({ id: userId })
        .then(result => {
          if (!result[0]) return false
          return result[0].count > 0
        })
    }
  }
}
