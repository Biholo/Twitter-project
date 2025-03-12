import { Repository } from "@/dependencies/constants";
import { TrendingRepository } from "@/domain/gateway/TrendingRepository";
import { GetTrendingHashtagQuery } from "@domain/dto/GetTrendingHashtagQuery";
import { GetTrendingTweetQuery } from "@domain/dto/GetTrendingTweetQuery";
import { inject, injectable } from "inversify";
import { subDays } from "date-fns";
import { HashtagCountAggregate } from "@domain/dto/HashtagCountAggregate";

@injectable()
export class TrendingConcreteService {
  constructor(
    @inject(Repository.HashtagRepository)
    private readonly hashtagRepository: TrendingRepository
  ) {}

  async getTrendingHashtags(
    query: GetTrendingHashtagQuery
  ): Promise<HashtagCountAggregate[]> {
    const from =
      query.timeframe === "weekly"
        ? subDays(new Date(), 7)
        : subDays(new Date(), 1);

    return this.hashtagRepository.findTrendingHashtags(from, query.limit);
  }

  async getTrendingTweets(query: GetTrendingTweetQuery) {}
}
