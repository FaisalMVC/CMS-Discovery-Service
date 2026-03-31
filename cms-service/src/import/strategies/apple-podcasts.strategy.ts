import { Injectable, Logger } from '@nestjs/common';
import { ImportStrategy, NormalizedProgram, NormalizedEpisode } from './import-strategy.interface';
import { ProgramType } from '../../common/enums/program-type.enum';
import * as xml2js from 'xml2js';

@Injectable()
export class ApplePodcastsStrategy implements ImportStrategy {
  private readonly logger = new Logger(ApplePodcastsStrategy.name);
  private readonly itunesSearchUrl = 'https://itunes.apple.com/lookup';

  public async fetch(config: { podcastId: string }): Promise<NormalizedProgram> {
    const { podcastId } = config;
    this.logger.log(`Fetching Apple Podcast: ${podcastId}`);
    const feedUrl = await this.getFeedUrl(podcastId);
    const { program, episodes } = await this.parseFeed(feedUrl, podcastId);
    return program;
  }

  private async getFeedUrl(podcastId: string): Promise<string> {
    const url = `${this.itunesSearchUrl}?id=${podcastId}&country=US`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`Podcast not found for ID: ${podcastId}`);
    }

    const feedUrl = data.results[0].feedUrl;

    if (!feedUrl) {
      throw new Error(`No RSS feed URL found for podcast ID: ${podcastId}`);
    }

    return feedUrl;
  }

  private async parseFeed(
    feedUrl: string,
    podcastId: string,
  ): Promise<{ program: NormalizedProgram; episodes: NormalizedEpisode[] }> {
    const response = await fetch(feedUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xml = await response.text();
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

    const channel = parsed?.rss?.channel;

    if (!channel) {
      throw new Error('Invalid RSS feed structure');
    }

    // Parse episodes
    const rawItems: any[] = Array.isArray(channel.item)
      ? channel.item
      : channel.item
      ? [channel.item]
      : [];

    const episodes: NormalizedEpisode[] = rawItems.map((item, index) => ({
      title: this.stripHtml(item.title) ?? `Episode ${index + 1}`,
      description: this.stripHtml(item.description ?? item['itunes:summary']),
      episodeNumber: item['itunes:episode']
        ? parseInt(item['itunes:episode'])
        : rawItems.length - index,
      seasonNumber: item['itunes:season'] ? parseInt(item['itunes:season']) : undefined,
      durationSeconds: this.parseDuration(item['itunes:duration']),
      publishDate: item.pubDate
        ? new Date(item.pubDate).toISOString().split('T')[0]
        : undefined,
      sourceId: item.guid?._ ?? item.guid ?? item.link,
      audioUrl: item.enclosure?.$.url,
      thumbnailUrl: item['itunes:image']?.$.href ?? channel['itunes:image']?.$.href,
    }));

    const program: NormalizedProgram = {
      title: this.stripHtml(channel.title) || '',
      description: this.stripHtml(channel.description ?? channel['itunes:summary']),
      type: ProgramType.PODCAST,
      language: channel.language ?? 'ar',
      thumbnailUrl: channel['itunes:image']?.$.href,
      source: 'apple_podcasts',
      sourceId: podcastId,
      episodes,
    };

    this.logger.log(`Parsed ${episodes.length} episodes from feed`);

    return { program, episodes };
  }

  private stripHtml(html?: string): string | undefined {
    if (!html) return undefined;
    return html
      .replace(/<[^>]*>/g, '')         
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')           
      .trim();
  }

  private parseDuration(duration?: string): number {
    if (!duration) return 0;
    if (/^\d+$/.test(duration)) {
      return parseInt(duration);
    }
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];

    return 0;
  }
}