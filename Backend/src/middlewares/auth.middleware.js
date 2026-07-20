const jwt = require('jsonwebtoken');



async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== 'user' && decoded.role !== 'admin'){
            return res.status(403).json({
                message: "You don't have access to this resource"
            });
        }
        req.user = decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(401).json({
            message: "Unauthorized",
            error: err.message
        });
    }
}


function authAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied."
        });
    }

    next();
}








module.exports = {
    authUser,
    authAdmin
}