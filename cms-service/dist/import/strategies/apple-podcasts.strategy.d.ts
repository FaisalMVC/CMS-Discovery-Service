import { ImportStrategy, NormalizedProgram } from './import-strategy.interface';
export declare class ApplePodcastsStrategy implements ImportStrategy {
    private readonly logger;
    private readonly itunesSearchUrl;
    fetch(config: {
        podcastId: string;
    }): Promise<NormalizedProgram>;
    private getFeedUrl;
    private parseFeed;
    private stripHtml;
    private parseDuration;
}
