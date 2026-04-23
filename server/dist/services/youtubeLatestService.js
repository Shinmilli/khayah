"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestYoutubeVideo = getLatestYoutubeVideo;
/** @khayahinternational2804 — RSS로 최신 업로드 1건 */
const DEFAULT_CHANNEL_ID = 'UCy-1WbDWu7vm05dStUD0Cxg';
const CHANNEL_HANDLE = 'khayahinternational2804';
const RSS_URL = (channelId) => `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
const UA = 'Mozilla/5.0 (compatible; KhayahSite/1.0)';
let cache = null;
const TTL_MS = 15 * 60 * 1000;
function decodeXmlEntities(s) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}
function parseFirstEntry(xml) {
    const open = xml.indexOf('<entry>');
    if (open === -1)
        return null;
    const start = open + '<entry>'.length;
    const close = xml.indexOf('</entry>', start);
    if (close === -1)
        return null;
    const block = xml.slice(start, close);
    const videoId = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const titleRaw = block.match(/<title>([^<]*)<\/title>/)?.[1];
    const publishedAt = block.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
    if (!videoId || !titleRaw || !publishedAt)
        return null;
    return {
        videoId,
        title: decodeXmlEntities(titleRaw.trim()),
        publishedAt,
    };
}
async function getLatestYoutubeVideo() {
    const now = Date.now();
    if (cache && cache.expires > now)
        return cache.data;
    const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || DEFAULT_CHANNEL_ID;
    const res = await fetch(RSS_URL(channelId), {
        headers: { 'User-Agent': UA, Accept: 'application/atom+xml,application/xml' },
    });
    if (!res.ok) {
        throw new Error(`YouTube RSS ${res.status}`);
    }
    const xml = await res.text();
    const parsed = parseFirstEntry(xml);
    if (!parsed) {
        throw new Error('YouTube RSS parse failed');
    }
    const data = {
        ...parsed,
        channelUrl: `https://www.youtube.com/@${CHANNEL_HANDLE}`,
    };
    cache = { data, expires: now + TTL_MS };
    return data;
}
//# sourceMappingURL=youtubeLatestService.js.map