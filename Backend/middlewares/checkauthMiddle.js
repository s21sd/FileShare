const jwt = require('jsonwebtoken');
function checkAuth(req, res, next) {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;
    console.log("Check Auth Token MIDDLEWARE ")
    if (!authToken || !refreshToken) {
        return res.status(401).json({
            message: 'Authentication failed: No authToken or refreshToken provided', ok: false
        })
    }
    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return res.status(401).json({
                        message: 'Auth failed',
                        ok: false
                    })
                }
                else {
                    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
                    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '50m' });

                    res.cookie('authToken', authToken, { httpOnly: true });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true });

                    res.userId = refreshDecoded.userId;
                    req.ok = true;
                    req.message = 'Auth Successfully';
                    next();

                }
            })
        }
        else {
            req.userId = decoded.userId;
            req.ok = true;
            req.message = "Authentication successful";
            next();

        }
    })
}

module.exports = checkAuth;