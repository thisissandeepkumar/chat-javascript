const sql = require('../utils/db');
const joi = require('joi');

const userSchema = joi.object({
    username: joi.string()
            .alphanum()
            .min(3)
            .max(255)
            .required(),
    password: joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: joi.string()
            .email(),
    firstname: joi.string(),
    lastname: joi.string()
});

const createUser = (user, result) => {
    sql.query("INSERT INTO user SET ?", user, (err, res) => {
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

const getUserByQuery = (queryObject, result) => {
    sql.query("SELECT * FROM user WHERE user." + queryObject.query + " = ?;", [queryObject.value], (err, res) => {
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

const getAllUsers = (result) => {
    sql.query("SELECT * FROM user", (err, res) => {
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

const updateUserByQuery = (queryObject, result) => {
    sql.query("UPDATE user SET ? = ? WHERE user.? = ?", [queryObject.field, queryObject.fieldValue, queryObject.query, queryObject.value], (err, res) =>{
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

const deleteUserByQuery = (queryObject, result) => {
    sql.query("DELETE user WHERE user.? = ?", [queryObject.query, queryObject.value], (err, res) => {
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

module.exports = {
    userSchema,
    createUser,
    getAllUsers,
    getUserByQuery,
    updateUserByQuery,
    deleteUserByQuery
}