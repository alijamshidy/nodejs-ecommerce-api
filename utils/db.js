const mongoose = require('mongoose');
const { debugLog } = require('./debugLog');

module.exports.dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DB_URL,{useNewUrlParser:true})
        console.log("database connected..")
        // #region agent log
        debugLog({location:'db.js:connected',message:'mongoose connected',data:{dbUrl:process.env.DB_URL,dbName:mongoose.connection.db?.databaseName,readyState:mongoose.connection.readyState},hypothesisId:'D'});
        // #endregion
    }catch (error) {
        console.log(error.message)
        // #region agent log
        debugLog({location:'db.js:error',message:'mongoose connect failed',data:{errorMessage:error.message,dbUrl:process.env.DB_URL},hypothesisId:'D'});
        // #endregion
    }
}