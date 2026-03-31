"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApplePodcastsStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplePodcastsStrategy = void 0;
const common_1 = require("@nestjs/common");
const program_type_enum_1 = require("../../common/enums/program-type.enum");
const xml2js = require("xml2js");
let ApplePodcastsStrategy = ApplePodcastsStrategy_1 = class ApplePodcastsStrategy {
    constructor() {
        this.logger = new common_1.Logger(ApplePodcastsStrategy_1.name);
        this.itunesSearchUrl = 'https://itunes.apple.com/lookup';
    }
    async fetch(config) {
        const { podcastId } = config;
        this.logger.log(`Fetching Apple Podcast: ${podcastId}`);
        const feedUrl = await this.getFeedUrl(podcastId);
        const { program, episodes } = await this.parseFeed(feedUrl, podcastId);
        return program;
    }
    async getFeedUrl(podcastId) {
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
    async parseFeed(feedUrl, podcastId) {
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
        const rawItems = Array.isArray(channel.item)
            ? channel.item
            : channel.item
                ? [channel.item]
                : [];
        const episodes = rawItems.map((item, index) => ({
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
        const program = {
            title: this.stripHtml(channel.title) || '',
            description: this.stripHtml(channel.description ?? channel['itunes:summary']),
            type: program_type_enum_1.ProgramType.PODCAST,
            language: channel.language ?? 'ar',
            thumbnailUrl: channel['itunes:image']?.$.href,
            source: 'apple_podcasts',
            sourceId: podcastId,
            episodes,
        };
        this.logger.log(`Parsed ${episodes.length} episodes from feed`);
        return { program, episodes };
    }
    stripHtml(html) {
        if (!html)
            return undefined;
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
    parseDuration(duration) {
        if (!duration)
            return 0;
        if (/^\d+$/.test(duration)) {
            return parseInt(duration);
        }
        const parts = duration.split(':').map(Number);
        if (parts.length === 3)
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2)
            return parts[0] * 60 + parts[1];
        return 0;
    }
};
exports.ApplePodcastsStrategy = ApplePodcastsStrategy;
exports.ApplePodcastsStrategy = ApplePodcastsStrategy = ApplePodcastsStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], ApplePodcastsStrategy);
//# sourceMappingURL=apple-podcasts.strategy.js.map