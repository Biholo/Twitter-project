import { HashtagCountAggregate } from "@domain/dto/HashtagCountAggregate";

export interface TrendingRepository {
  findTrendingHashtags(from: Date, limit?: number): Promise<HashtagCountAggregate[]>;
  findTrendingTweets(): Promise<void>;
}
