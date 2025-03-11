import Follow, { IFollow } from "@/models/followModel";
import {BaseRepository} from "./baseRepository";

class FollowRepository extends BaseRepository<IFollow> {
  constructor() {
    super(Follow);
  }
}
const followRepository = new FollowRepository();
export default followRepository;
