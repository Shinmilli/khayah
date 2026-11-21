export type PopupButtonLabels = {
    ko: string;
    en: string;
};
export type PopupItem = {
    id: string;
    enabled: boolean;
    imageUrl: string;
    linkUrl: string;
    buttonEnabled: boolean;
    buttonLabels: PopupButtonLabels;
    buttonUrl: string;
    /** YYYY-MM-DD. 비우면 시작 제한 없음 */
    startsOn: string;
    /** YYYY-MM-DD. 비우면 종료 제한 없음 */
    endsOn: string;
};
export type PopupDocument = {
    version: 1;
    items: PopupItem[];
};
export declare function parsePopupDocument(body: unknown): PopupDocument | null;
export declare function readPopupDocument(): Promise<PopupDocument | null>;
export declare function emptyPopupDocument(): PopupDocument;
export declare function writePopupDocument(body: unknown): Promise<PopupDocument>;
//# sourceMappingURL=popupFileService.d.ts.map