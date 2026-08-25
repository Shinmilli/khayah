import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto'

function scrypt(password: string, salt: Buffer, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey as Buffer)
    })
  })
}

/** scrypt 해시 저장 형식: scrypt$saltHex$hashHex */
export async function hashPin(pin: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scrypt(pin, salt, 32)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const salt = Buffer.from(parts[1]!, 'hex')
  const expected = Buffer.from(parts[2]!, 'hex')
  if (salt.length === 0 || expected.length === 0) return false
  const key = await scrypt(pin, salt, expected.length)
  if (key.length !== expected.length) return false
  return timingSafeEqual(key, expected)
}
