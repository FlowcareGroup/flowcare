import { validationResult } from "express-validator";

const validatorChecker = (req,res,next) =>{
    const result = validationResult(req);
    const errors = result.array();

    if(errors.length > 0){
        return res.status(400).json(errors);
    }

    next();
};

export default validatorChecker;