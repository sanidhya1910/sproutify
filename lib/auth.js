import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Using bcryptjs's *sync* variants deliberately: the async versions chunk
// their work via Node's `setImmediate` internally, which behaves
// unreliably under Cloudflare Workers' nodejs_compat (compare() was
// observed to always resolve `false` there, even for a correct
// password/hash pair) — the sync path skips that machinery entirely and
// works correctly in both Node.js and Workers.
export const hashPassword = async (password) => {
  return bcrypt.hashSync(password, 12)
}

export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

/**
 * `name` is in the payload because the app shell renders the signed-in user's
 * name and avatar initials straight from the decoded token (it has no
 * /api/me endpoint). Without it every authenticated page showed a "?" avatar
 * next to the label "Account".
 */
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}