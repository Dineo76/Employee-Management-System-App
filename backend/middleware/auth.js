const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET ;
//fetch the token from Authorization API
function authMiddleware(req, res, next) {
 const auth = req.headers.authorization;
 if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
 const parts = auth.split(' ');
 if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed Authorization header' });
 const token = parts[1];
 try {
   const payload = jwt.verify(token, jwtSecret);
   req.userId = payload.userId;
   req.userRole = payload.role;
   next();
 } catch (err) {
   return res.status(401).json({ error: 'Invalid or expired token' });
 }
}

module.exports = authMiddleware;