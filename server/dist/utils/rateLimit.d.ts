/** 단순 인메모리 rate limit (프로세스 단위). 초과 시 true */
export declare function isRateLimited(key: string, limit: number, windowMs: number): boolean;
export declare function clientIp(req: {
    ip?: string;
    headers: Record<string, unknown>;
}): string;
//# sourceMappingURL=rateLimit.d.ts.map