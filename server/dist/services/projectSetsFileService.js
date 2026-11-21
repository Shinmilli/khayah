"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readProjectSetsDocument = readProjectSetsDocument;
exports.readProjectSetsState = readProjectSetsState;
exports.writeProjectSetsDocument = writeProjectSetsDocument;
const projectSets_default_json_1 = __importDefault(require("../data/projectSets.default.json"));
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'project-sets';
const CATEGORIES = ['국내', '해외', '연구'];
const FIELDS = ['', '교육', '해외봉사단', '긴급구호'];
const PAGE_KEYS = ['domestic', 'overseas', 'education', 'volunteer', 'research'];
function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function text(value, fallback = '', max = 2000) {
    const raw = typeof value === 'string' ? value : fallback;
    return raw.replace(/\r\n/g, '\n').slice(0, max);
}
function flag(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
}
function lines(value, max, lineMax = 20000) {
    const source = Array.isArray(value) ? value : [];
    return source
        .filter((line) => typeof line === 'string')
        .map((line) => line.slice(0, lineMax))
        .slice(0, max);
}
function media(value, max) {
    const source = Array.isArray(value) ? value : [];
    return source.filter(isPlainObject).slice(0, max).map((row) => ({
        src: text(row.src, '', 2000),
        alt: text(row.alt, '', 400),
    }));
}
function defaultDocument() {
    return projectSets_default_json_1.default;
}
const BLOCK_TYPES = ['intro', 'facts', 'flow', 'cards', 'timeline', 'cases', 'photos', 'image'];
function pageBlocks(value) {
    const rows = Array.isArray(value) ? value : [];
    return rows.filter(isPlainObject).slice(0, 8).flatMap((row, index) => {
        const type = BLOCK_TYPES.includes(row.type) ? row.type : null;
        const id = text(row.id, '', 40);
        if (!type || !id)
            return [];
        return [{
                id,
                type,
                enabled: flag(row.enabled, true),
                order: Math.round(Number(row.order) || index),
                kicker: text(row.kicker, '', 120),
                title: text(row.title, '', 120),
                emphasis: text(row.emphasis, '', 40),
                lead: text(row.lead, '', 800),
                photo: text(row.photo, '', 400),
                photoAlt: text(row.photoAlt, '', 200),
                photoSide: row.photoSide === 'left' || row.photoSide === 'none' ? row.photoSide : 'right',
                cards: (Array.isArray(row.cards) ? row.cards : []).filter(isPlainObject).slice(0, 4).map((card) => ({
                    value: text(card.value, '', 40),
                    unit: text(card.unit, '', 20),
                    note: text(card.note, '', 80),
                    source: text(card.source, '', 80),
                })),
                steps: (Array.isArray(row.steps) ? row.steps : []).filter(isPlainObject).slice(0, 6).map((step) => ({
                    name: text(step.name, '', 40),
                    body: text(step.body, '', 200),
                })),
                items: (Array.isArray(row.items) ? row.items : []).filter(isPlainObject).slice(0, 8).map((item) => ({
                    title: text(item.title, '', 80),
                    body: text(item.body, '', 300),
                    href: text(item.href, '', 200),
                    year: text(item.year, '', 20),
                })),
                photos: (Array.isArray(row.photos) ? row.photos : []).filter(isPlainObject).slice(0, 3).map((photo) => ({
                    src: text(photo.src, '', 400),
                    alt: text(photo.alt, '', 200),
                })),
            }];
    });
}
function introAlign(row, fallback) {
    const blank = [row.introKicker, row.introTitle, row.emphasis, row.lead].every((value) => typeof value !== 'string' || !value.trim());
    if (blank)
        return fallback.align === 'left' ? 'left' : 'center';
    return row.align === 'left' ? 'left' : 'center';
}
function pageHeader(value, fallback) {
    const row = isPlainObject(value) ? value : {};
    const cards = (Array.isArray(row.cards) ? row.cards : fallback.cards ?? [])
        .filter(isPlainObject)
        .slice(0, 4)
        .map((card) => ({
        value: text(card.value, '', 40),
        unit: text(card.unit, '', 20),
        note: text(card.note, '', 80),
        source: text(card.source, '', 80),
    }));
    const flow = (Array.isArray(row.flow) ? row.flow : fallback.flow ?? [])
        .filter(isPlainObject)
        .slice(0, 8)
        .map((step) => ({
        name: text(step.name, '', 40),
        body: text(step.body, '', 200),
    }));
    const axes = (Array.isArray(row.axes) ? row.axes : fallback.axes ?? [])
        .filter(isPlainObject)
        .slice(0, 3)
        .map((axis) => ({
        label: text(axis.label, '', 80),
        phrase: text(axis.phrase, '', 120),
        title: text(axis.title, '', 80),
        body: text(axis.body, '', 800),
        cards: (Array.isArray(axis.cards) ? axis.cards : [])
            .filter(isPlainObject)
            .slice(0, 8)
            .map((card) => ({
            title: text(card.title, '', 80),
            subtitle: text(card.subtitle, '', 80),
            body: text(card.body, '', 400),
            tag: text(card.tag, '', 120),
        })),
        cases: (Array.isArray(axis.cases) ? axis.cases : [])
            .filter(isPlainObject)
            .slice(0, 8)
            .map((item) => ({
            place: text(item.place, '', 80),
            body: text(item.body, '', 300),
        })),
        photos: (Array.isArray(axis.photos) ? axis.photos : [])
            .filter(isPlainObject)
            .slice(0, 3)
            .map((photo) => ({
            src: text(photo.src, '', 400),
            alt: text(photo.alt, '', 200),
        })),
        enabled: flag(axis.enabled, true),
        mode: axis.mode === 'image' ? 'image' : 'text',
        image: text(axis.image, '', 400),
    }));
    return {
        title: text(row.title, fallback.title, 80),
        eyebrow: text(row.eyebrow, fallback.eyebrow, 120),
        photo: text(row.photo, fallback.photo, 400),
        photoAlt: text(row.photoAlt, fallback.photoAlt, 200),
        cards,
        flow,
        heroLabel: text(row.heroLabel, fallback.heroLabel, 80),
        introKicker: text(row.introKicker, fallback.introKicker, 120),
        introKickerKo: text(row.introKickerKo, fallback.introKickerKo, 80),
        introTitle: text(row.introTitle, fallback.introTitle, 120),
        emphasis: text(row.emphasis, fallback.emphasis, 40),
        lead: text(row.lead, fallback.lead, 400),
        align: introAlign(row, fallback),
        photoSide: row.photoSide === 'left' || row.photoSide === 'none' || row.photoSide === 'right' ? row.photoSide : fallback.photoSide === 'left' || fallback.photoSide === 'none' ? fallback.photoSide : 'right',
        band: row.band === 'white' ? 'white' : fallback.band === 'white' ? 'white' : 'gray',
        blocks: pageBlocks(row.blocks ?? fallback.blocks),
        panels: (Array.isArray(row.panels) ? row.panels : fallback.panels ?? [])
            .filter(isPlainObject)
            .slice(0, 12)
            .map((item, index) => ({
            id: text(item.id, '', 40),
            order: typeof item.order === 'number' && Number.isFinite(item.order) ? Math.round(item.order) : index,
            enabled: flag(item.enabled, true),
            removed: flag(item.removed, false),
        }))
            .filter((item) => item.id),
        axes,
    };
}
function normalizeItem(value, index) {
    if (!isPlainObject(value))
        return null;
    const base = defaultDocument().items[index];
    const category = CATEGORIES.includes(value.category) ? value.category : base?.category;
    if (!category)
        return null;
    const field = FIELDS.includes(value.field) ? value.field : '';
    const yearRaw = value.year;
    const year = typeof yearRaw === 'number' && Number.isFinite(yearRaw) ? Math.round(yearRaw) : yearRaw === null ? null : (base?.year ?? null);
    const steps = (Array.isArray(value.steps) ? value.steps : [])
        .filter(isPlainObject)
        .slice(0, 6)
        .map((step) => ({
        kicker: text(step.kicker, '', 40),
        title: text(step.title, '', 80),
        detail: text(step.detail, '', 200),
        emphasis: false,
    }));
    const facts = [0, 1, 2].map((slot) => {
        const row = Array.isArray(value.facts) && isPlainObject(value.facts[slot]) ? value.facts[slot] : {};
        return {
            value: text(row.value, '', 20),
            unit: text(row.unit, '', 20),
            label: text(row.label, '', 200),
        };
    });
    const id = text(value.id, base?.id || `set-${index + 1}`, 80).trim() || `set-${index + 1}`;
    return {
        id,
        category,
        field,
        year: year != null && (year < 1990 || year > 2100) ? null : year,
        enabled: flag(value.enabled, true),
        order: Number.isFinite(Number(value.order)) ? Math.round(Number(value.order)) : index,
        eyebrow: text(value.eyebrow, '', 160),
        title: text(value.title, '', 200),
        period: text(value.period, '', 80),
        audience: text(value.audience, '', 120),
        partner: text(value.partner, '', 200),
        paragraphs: lines(value.paragraphs, 400),
        slides: media(value.slides, 40),
        showArrows: flag(value.showArrows, false),
        emphasizeLast: flag(value.emphasizeLast, false),
        stepsOn: flag(value.stepsOn, true),
        steps,
        factsOn: flag(value.factsOn, true),
        facts,
        note: text(value.note, '', 200),
        photosOn: flag(value.photosOn, true),
        photos: [0, 1, 2].map((slot) => {
            const row = Array.isArray(value.photos) && isPlainObject(value.photos[slot]) ? value.photos[slot] : {};
            return { src: text(row.src, '', 400), alt: text(row.alt, '', 400) };
        }),
    };
}
function normalize(body) {
    const base = defaultDocument();
    const source = isPlainObject(body) ? body : base;
    const pagesIn = isPlainObject(source.pages) ? source.pages : {};
    const pages = {};
    for (const key of PAGE_KEYS)
        pages[key] = pageHeader(pagesIn[key], base.pages[key]);
    const rows = Array.isArray(source.items) ? source.items : base.items;
    const items = [];
    const seen = new Set();
    rows.forEach((row, index) => {
        const item = normalizeItem(row, index);
        if (!item)
            return;
        let id = item.id;
        while (seen.has(id))
            id = `${id}-${items.length + 1}`;
        seen.add(id);
        items.push({ ...item, id });
    });
    return { version: 1, pages, items };
}
async function readProjectSetsDocument() {
    try {
        return normalize(await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY));
    }
    catch (e) {
        const status = e.status;
        if (status === 404)
            return normalize(defaultDocument());
        throw e;
    }
}
function readProjectSetsState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readProjectSetsDocument, preferDraft);
}
async function writeProjectSetsDocument(body, mode = 'publish') {
    if (!isPlainObject(body) || body.version !== 1) {
        const err = new Error('Invalid project sets payload');
        err.status = 400;
        throw err;
    }
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, normalize(body), mode);
}
//# sourceMappingURL=projectSetsFileService.js.map