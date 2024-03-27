// authController.js
const User = require('../models/models.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json('Tous les champs sont requis');
        }
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(401).send('Cet email est déjà utilisé.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user = new User({
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        // Enregistre l'utilisateur dans la base de données
        await user.save();

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).send({
        ok: true,
        data: {
            token: token,
            user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
            }
        }
        });
        } catch (error) {
            res.status(500).send({ message: 'Erreur interne du serveur.', error: error.message });
        }
};

exports.login = async (req, res) => {
    try {
        if (!email || !password) {
            return res.status(400).json('Tous les champs sont requis');
        }
        // Chercher l'utilisateur par email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send('Aucun utilisateur trouvé avec cet email.');
        }
        // Comparer le mot de passe fourni avec celui de la base de données
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send('Mot de passe incorrect.');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.satus(200).send({
            ok: true,
            data: {
            token: token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
            }
        });
        } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur.');
        }
  };
