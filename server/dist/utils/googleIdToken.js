"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = verifyGoogleIdToken;
const google_auth_library_1 = require("google-auth-library");
let client = null;
function googleClientId() {
    return (process.env.GOOGLE_CLIENT_ID ?? '').trim();
}
async function verifyGoogleIdToken(idToken) {
    const audience = googleClientId();
    if (!audience) {
        throw new Error('GOOGLE_CLIENT_ID is not set');
    }
    if (!client)
        client = new google_auth_library_1.OAuth2Client(audience);
    const ticket = await client.verifyIdToken({ idToken, audience });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error('empty Google token payload');
    }
    return {
        email: payload.email ?? '',
        emailVerified: payload.email_verified === true,
        name: (payload.name ?? '').trim(),
    };
}
//# sourceMappingURL=googleIdToken.js.map