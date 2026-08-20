"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestYoutubeVideo = getLatestYoutubeVideo;
/** @khayahinternational2804 — RSS로 최신 업로드 1건 */
const DEFAULT_CHANNEL_ID = 'UCy-1WbDWu7vm05dStUD0Cxg';
const CHANNEL_HANDLE = 'khayahinternational2804';
const RSS_HEADERS = {
    // YouTube RSS는 단순/봇 UA에 404를 반환하는 경우가 많음 (특히 Render 등 클라우드 IP)
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/atom+xml,application/xml,text/xml,*/*;q=0.9',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};
const FETCH_TIMEOUT_MS = 20000;
const RSS_ATTEMPTS = 3;
const RSS_RETRY_DELAY_MS = 700;
/** RSS 전부 실패 시 (env 또는 채널 최신 영상 기본값) */
const DEFAULT_FALLBACK_VIDEO_ID = 'my_KtM2p4q0';
const DEFAULT_FALLBACK_TITLE = '2026 경기청년 기후특사단 국내교육 스케치 영상';
const DEFAULT_FALLBACK_PUBLISHED_AT = '2026-01-01T00:00:00+00:00';
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function channelUrl() {
    return `https://www.youtube.com/@${CHANNEL_HANDLE}`;
}
function fallbackLatest() {
    return {
        videoId: process.env.YOUTUBE_FALLBACK_VIDEO_ID?.trim() || DEFAULT_FALLBACK_VIDEO_ID,
        title: process.env.YOUTUBE_FALLBACK_TITLE?.trim() || DEFAULT_FALLBACK_TITLE,
        publishedAt: process.env.YOUTUBE_FALLBACK_PUBLISHED_AT?.trim() || DEFAULT_FALLBACK_PUBLISHED_AT,
        channelUrl: channelUrl(),
    };
}
function rssUrls(channelId) {
    const uploadsPlaylistId = channelId.startsWith('UC') ? `UU${channelId.slice(2)}` : channelId;
    return [
        `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`,
        `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(uploadsPlaylistId)}`,
    ];
}
let cache = null;
const TTL_MS = 15 * 60 * 1000;
const STALE_GRACE_MS = 24 * 60 * 60 * 1000;
async function fetchRssXml(url) {
    let lastError;
    for (let attempt = 1; attempt <= RSS_ATTEMPTS; attempt++) {
        try {
            const res = await fetch(url, {
                headers: RSS_HEADERS,
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
            if (!res.ok) {
                throw new Error(`YouTube RSS ${res.status} for ${url}`);
            }
            return await res.text();
        }
        catch (e) {
            lastError = e;
            if (attempt < RSS_ATTEMPTS) {
                await sleep(RSS_RETRY_DELAY_MS * attempt);
            }
        }
    }
    throw lastError instanceof Error ? lastError : new Error(`YouTube RSS fetch failed: ${url}`);
}
async function fetchRssForChannel(channelId) {
    let lastError;
    for (const url of rssUrls(channelId)) {
        try {
            return await fetchRssXml(url);
        }
        catch (e) {
            lastError = e;
            console.warn('[youtube] RSS fetch failed, trying next URL', url, e);
        }
    }
    throw lastError instanceof Error ? lastError : new Error('YouTube RSS fetch failed');
}
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
    try {
        const xml = await fetchRssForChannel(channelId);
        const parsed = parseFirstEntry(xml);
        if (!parsed) {
            throw new Error('YouTube RSS parse failed');
        }
        const data = {
            ...parsed,
            channelUrl: channelUrl(),
        };
        cache = { data, expires: now + TTL_MS };
        return data;
    }
    catch (e) {
        if (cache && now - cache.expires < STALE_GRACE_MS) {
            console.warn('[youtube] serving stale cache after fetch error', e);
            return cache.data;
        }
        const fallback = fallbackLatest();
        console.error('[youtube] RSS unavailable, using fallback video', e);
        cache = { data: fallback, expires: now + TTL_MS };
        return fallback;
    }
}
//# sourceMappingURL=youtubeLatestService.js.map