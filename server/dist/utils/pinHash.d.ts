/** scrypt 해시 저장 형식: scrypt$saltHex$hashHex */
export declare function hashPin(pin: string): Promise<string>;
export declare function verifyPin(pin: string, stored: string): Promise<boolean>;
//# sourceMappingURL=pinHash.d.ts.map