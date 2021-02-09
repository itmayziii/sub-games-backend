import { loadFiles } from '@graphql-tools/load-files'
import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { DocumentNode } from 'graphql'

export async function loadTypeDefs (): Promise<DocumentNode> {
  return await loadFiles(path.resolve(__dirname, '../../type-defs'), { extensions: ['graphql'] })
    .then(types => mergeTypeDefs(types))
}
