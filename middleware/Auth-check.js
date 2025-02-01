import jwt from 'jsonwebtoken';
import HttpError from '../models/Httperror.js';

const checkAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authentication failed: Token missing!" });
    }
    try{
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        const error = new HttpError('No token provided',401);
        return next(error);
    }
    if(token.user === token){
        const error = new HttpError('wrong token',401);
        return next(error);
    }
    const decoded = jwt.verify(token,'defaultsecret');
    req.userData={ email : decoded.email };
    next();
}catch(err){
    const error = new HttpError('Authantication failed',401);
    console.log(err);
    console.log(authHeader);
    return next(error);
};
}


export default checkAuth;