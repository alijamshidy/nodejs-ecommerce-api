const jwt = require('jsonwebtoken')
const { debugLog } = require('../utils/debugLog')

module.exports.authMiddleware = async(req,res,next) => {
    const {accessToken} = req.cookies
    // #region agent log
    debugLog({location:'authMiddleware.js:entry',message:'authMiddleware called',data:{hasCookie:!!accessToken,path:req.path,dbUrl:process.env.DB_URL},hypothesisId:'B'});
    // #endregion
    if (!accessToken) {
        return res.status(409).json({error: 'Please Login First'})
    } else {
        try {
            const deCodeToken = await jwt.verify(accessToken,process.env.SECRET)
            req.role = deCodeToken.role
            req.id = deCodeToken.id
            // #region agent log
            debugLog({location:'authMiddleware.js:verified',message:'token verified',data:{role:deCodeToken.role,id:deCodeToken.id,idType:typeof deCodeToken.id},hypothesisId:'A,C'});
            // #endregion
            next()
        } catch (error) {
            // #region agent log
            debugLog({location:'authMiddleware.js:verify-fail',message:'token verify failed',data:{errorName:error.name,errorMessage:error.message},hypothesisId:'B'});
            // #endregion
            return res.status(409).json({error: 'Please Login'})
        }
    }
}