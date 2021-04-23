
const notEmailErrorHandler = (error) => {
    const message = error.details[0].message;
    if (message == '"value" must be a valid email'){
        return true;
    }
    else{
        return false;
    }
};

module.exports = {
    notEmailErrorHandler
};