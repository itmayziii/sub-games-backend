import * as Knex from 'knex'
import ApprovedStreamer from '../interfaces/models/approved-streamer'
import ApprovedStreamerRepository from '../interfaces/repositories/approved-streamer.repository'

export default function KnexApprovedStreamerRepository (db: Knex): ApprovedStreamerRepository {
  return {
    async find (id) {
      return await db.first<ApprovedStreamer>().from('approvedStreamer').where({ id })
        .then(result => result)
    },
    async isStreamerApproved (userId) {
      return await db('approvedStreamer').count<Array<{ count: number }>>('id').where({ id: userId })
        .then(result => {
          if (result[0] === undefined) return false
          return result[0].count > 0
        })
    }
  }
}
