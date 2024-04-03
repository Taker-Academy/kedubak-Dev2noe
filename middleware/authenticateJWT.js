// middleware/authenticateJWT.js
const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
    console.log('Middleware authenticateJWT appelé');
    const authHeader = req.headers.authorization;

    if (authHeader) {
        console.log('En-tête d\'autorisation trouvé:', authHeader);
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Erreur de vérification du JWT:', err.message);
                return res.sendStatus(401);
            }
            console.log('Token JWT décodé:', decoded);
            req.user = decoded;
            next();
        });
    } else {
        console.log('Aucun en-tête d\'autorisation trouvé');
        res.sendStatus(401);
    }
};
