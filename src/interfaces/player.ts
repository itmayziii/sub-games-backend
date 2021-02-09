import User from "./user";

export default interface Player extends User {
  playCount: number
  allTimePlayCount: number
}
