"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocialLatest = getSocialLatest;
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const FETCH_TIMEOUT_MS = 15000;
const TTL_MS = 15 * 60 * 1000;
const STALE_GRACE_MS = 24 * 60 * 60 * 1000;
let cache = null;
function httpsUrl(url) {
    return url.replace(/^http:\/\//i, 'https://');
}
function decodeXmlEntities(s) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}
function tagValue(xml, tag) {
    const cdata = xml.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i'));
    if (cdata?.[1])
        return decodeXmlEntities(cdata[1].trim());
    const plain = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'));
    return decodeXmlEntities((plain?.[1] ?? '').trim());
}
function stripHtml(s) {
    return s
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function clip(s, max) {
    const t = stripHtml(s);
    if (t.length <= max)
        return t;
    return `${t.slice(0, max).trim()}…`;
}
function firstImgSrc(html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    const src = m?.[1]?.trim();
    if (!src)
        return null;
    return httpsUrl(decodeXmlEntities(src));
}
function isUsableImageUrl(url) {
    try {
        const host = new URL(url).hostname;
        // RSS 채널 프로필 썸네일 호스트는 외부에서 열리지 않는 경우가 많음
        if (host === 'blogpfthumb.phinf.naver.net')
            return false;
        return true;
    }
    catch {
        return false;
    }
}
function toIso(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime()))
        return null;
    return d.toISOString();
}
function blogId() {
    return process.env.NAVER_BLOG_ID?.trim() || 'khayah';
}
function blogHomeUrl() {
    return `https://blog.naver.com/${blogId()}`;
}
function instagramUsername() {
    return process.env.INSTAGRAM_USERNAME?.trim() || 'khayah_international';
}
function instagramProfileUrl() {
    return `https://www.instagram.com/${instagramUsername()}`;
}
function fallbackBlog() {
    return {
        url: blogHomeUrl(),
        title: 'Khayah International',
        description: '사람을 키우고 섬기는 개발 NGO 카야인터내셔널',
        image: null,
        publishedAt: null,
    };
}
function fallbackInstagram() {
    return {
        url: instagramProfileUrl(),
        title: '',
        description: '',
        image: null,
        publishedAt: null,
    };
}
async function fetchText(url, accept) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': BROWSER_UA,
            Accept: accept,
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok)
        throw new Error(`${url} ${res.status}`);
    return res.text();
}
async function fetchJson(url) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': BROWSER_UA,
            Accept: 'application/json',
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok)
        throw new Error(`${url} ${res.status}`);
    return (await res.json());
}
async function loadBlogPreview() {
    const xml = await fetchText(`https://rss.blog.naver.com/${encodeURIComponent(blogId())}.xml`, 'application/rss+xml,application/xml,text/xml,*/*;q=0.8');
    const channel = xml.split(/<item[\s>]/i)[0] ?? xml;
    const profileImage = tagValue(channel, 'url');
    const about = clip(tagValue(channel, 'description'), 90);
    const itemOpen = xml.search(/<item[\s>]/i);
    const itemXml = itemOpen >= 0 ? xml.slice(itemOpen, xml.indexOf('</item>', itemOpen) + 7) : '';
    const postTitle = itemXml ? tagValue(itemXml, 'title') : '';
    const postLink = itemXml ? tagValue(itemXml, 'link').replace(/\?fromRss=true.*$/, '') : '';
    const rawDesc = itemXml ? tagValue(itemXml, 'description') : '';
    const postDesc = rawDesc ? clip(rawDesc, 88) : '';
    const publishedAt = itemXml ? toIso(tagValue(itemXml, 'pubDate')) : null;
    const postImage = firstImgSrc(rawDesc);
    const profile = profileImage ? httpsUrl(profileImage) : null;
    const imageCandidates = [postImage, profile].filter((url) => Boolean(url));
    const image = imageCandidates.find((url) => isUsableImageUrl(url)) ?? null;
    return {
        url: postLink || blogHomeUrl(),
        title: postTitle || tagValue(channel, 'title') || 'Khayah International',
        description: postDesc || about,
        image,
        publishedAt,
    };
}
async function loadInstagramPreview() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
    if (!token)
        return fallbackInstagram();
    const user = await fetchJson(`https://graph.instagram.com/me?fields=username,name,biography,profile_picture_url&access_token=${encodeURIComponent(token)}`);
    let media = null;
    try {
        const mediaRes = await fetchJson(`https://graph.instagram.com/me/media?fields=caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=1&access_token=${encodeURIComponent(token)}`);
        media = mediaRes.data?.[0] ?? null;
    }
    catch (e) {
        console.warn('[instagram] media fetch failed', e);
    }
    const postImage = media?.media_type === 'VIDEO' ? media.thumbnail_url || media.media_url : media?.media_url || media?.thumbnail_url;
    const caption = clip(media?.caption ?? '', 88);
    return {
        url: media?.permalink || instagramProfileUrl(),
        title: caption || user.name || user.username || instagramUsername(),
        description: caption ? clip(user.biography || '', 72) : clip(user.biography || '', 90),
        image: postImage || user.profile_picture_url || null,
        publishedAt: media?.timestamp || null,
    };
}
async function getSocialLatest() {
    const now = Date.now();
    if (cache && cache.expires > now)
        return cache.data;
    const [blogSettled, igSettled] = await Promise.allSettled([loadBlogPreview(), loadInstagramPreview()]);
    const blog = blogSettled.status === 'fulfilled' ? blogSettled.value : fallbackBlog();
    const instagram = igSettled.status === 'fulfilled' ? igSettled.value : fallbackInstagram();
    if (blogSettled.status === 'rejected') {
        console.warn('[blog] RSS failed', blogSettled.reason);
        if (cache && now - cache.expires < STALE_GRACE_MS)
            return cache.data;
    }
    if (igSettled.status === 'rejected') {
        console.warn('[instagram] fetch failed', igSettled.reason);
    }
    const data = { blog, instagram };
    cache = { data, expires: now + TTL_MS };
    return data;
}
//# sourceMappingURL=socialLatestService.js.map