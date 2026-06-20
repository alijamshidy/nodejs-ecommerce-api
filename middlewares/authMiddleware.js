const jwt = require("jsonwebtoken");
const { debugLog } = require("../utils/debugLog");

function decodeCookieToken(value) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractToken(req) {
  const accessCookie = decodeCookieToken(req.cookies?.accessToken);
  if (accessCookie) return accessCookie;

  const customerCookie = decodeCookieToken(req.cookies?.customerToken);
  if (customerCookie) return customerCookie;

  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch?.[1]) {
    return bearerMatch[1].trim();
  }

  return undefined;
}

module.exports.authMiddleware = async (req, res, next) => {
  const accessToken = extractToken(req);
  // #region agent log
  debugLog({
    location: "authMiddleware.js:entry",
    message: "authMiddleware called",
    data: { hasCookie: !!accessToken, path: req.path, dbUrl: process.env.DB_URL },
    hypothesisId: "B",
  });
  // #endregion
  if (!accessToken) {
    return res.status(409).json({ error: "Please Login First" });
  }

  try {
    const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);
    req.role = deCodeToken.role ?? "customer";
    req.id = deCodeToken.id;
    // #region agent log
    debugLog({
      location: "authMiddleware.js:verified",
      message: "token verified",
      data: {
        role: req.role,
        id: deCodeToken.id,
        idType: typeof deCodeToken.id,
      },
      hypothesisId: "A,C",
    });
    // #endregion
    next();
  } catch (error) {
    // #region agent log
    debugLog({
      location: "authMiddleware.js:verify-fail",
      message: "token verify failed",
      data: { errorName: error.name, errorMessage: error.message },
      hypothesisId: "B",
    });
    // #endregion
    return res.status(409).json({ error: "Please Login" });
  }
};
