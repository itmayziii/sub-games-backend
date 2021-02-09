import {loadFiles} from "@graphql-tools/load-files";
import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";

export function loadTypeDefs () {
  return loadFiles(path.resolve(__dirname, '../../type-defs'), { extensions: ['graphql'] })
    .then(types => mergeTypeDefs(types))
}
