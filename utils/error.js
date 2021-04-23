
const notEmailErrorHandler = (error) => {
    const message = error.details[0].message;
    if (message == '"value" must be a valid email'){
        return true;
    }
    else{
        return false;
    }
};

const handleCreatedData = (req, res, next, err, data) => {
    if(err != null){
        console.log(err);
        res.status(401).json({'error': err});
    }
    else{
        console.log(data);
        res.status(201).json(data);
    }
};

const handleGetData = (req, res, next, err, data) => {
    if(err != null){
        console.log(err);
        res.status(401).json({'error': err});
    }
    else{
        res.status(200).json(data);
    }
};

module.exports = {
    notEmailErrorHandler,
    handleCreatedData,
    handleGetData
};