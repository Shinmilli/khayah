import { OAuth2Client } from 'google-auth-library'

let client: OAuth2Client | null = null

function googleClientId(): string {
  return (process.env.GOOGLE_CLIENT_ID ?? '').trim()
}

export async function verifyGoogleIdToken(idToken: string): Promise<{
  email: string
  emailVerified: boolean
  name: string
}> {
  const audience = googleClientId()
  if (!audience) {
    throw new Error('GOOGLE_CLIENT_ID is not set')
  }
  if (!client) client = new OAuth2Client(audience)
  const ticket = await client.verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()
  if (!payload) {
    throw new Error('empty Google token payload')
  }
  return {
    email: payload.email ?? '',
    emailVerified: payload.email_verified === true,
    name: (payload.name ?? '').trim(),
  }
}
