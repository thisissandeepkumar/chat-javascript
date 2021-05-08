const sql = require('../utils/db');


const createRow = (token, user, result) => {
    sql.query("INSERT INTO fcm SET ?", {'token': token, 'user': user}, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        else{
            result(null, res);
            return;
        }
    });
};

const getTokenByUser = (userID, result) => {
    sql.query("SELECT fcm.token FROM fcm WHERE fcm.user = ?", [userID], (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        else{
            result(null, res);
            return;
        }
    } );
};

module.exports = {
    createRow,
    getTokenByUser
};