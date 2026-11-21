export type MaintenanceDocument = {
    version: 1;
    enabled: boolean;
    titleKo: string;
    titleEn: string;
    messageKo: string;
    messageEn: string;
};
export declare const DEFAULT_MAINTENANCE_DOCUMENT: MaintenanceDocument;
export declare function normalizeMaintenanceDocument(body: unknown): MaintenanceDocument;
export declare function readMaintenanceDocument(): Promise<MaintenanceDocument>;
export declare function writeMaintenanceDocument(body: unknown): Promise<void>;
//# sourceMappingURL=maintenanceFileService.d.ts.map