const User = require('../models/models.js');
const bcrypt = require('bcryptjs');

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('email firstName lastName');
        if (!user) {
            return res.status(404).json({ ok: false, message: "Utilisateur non trouvé." });
        }
        const responseData = {
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Erreur interne du serveur." });
    }
};

exports.editUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ ok: false, message: "Utilisateur non trouvé." });
        }
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        // Si un nouveau mot de passe est fourni, le hacher
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        await user.save();
        res.status(200).json({
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Erreur interne du serveur." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ ok: false, message: "Utilisateur non trouvé." });
        }
        const response = {
            ok: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                removed: true
            }
        };
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Erreur interne du serveur." });
    }
};


