const Post = require('../models/postModel.js');
const User = require('../models/userModel.js');

exports.getPosts = async (req, res) => {
    try {
        // formater une réponse avec la liste des posts
        const post = await Post.find({}).lean().exec();
        const formattedPosts = post.map(post => ({
            _id: post._id,
            createdAt: post.createdAt,
            userId: post.userId,
            firstName: post.firstName,
            title: post.title,
            content: post.content,
            comments: post.comments.map(comment => ({
                id: comment._id,
                firstName: comment.firstName,
                content: comment.content
            })),
            upVotes: post.upVotes
        }));

        res.status(200).json({
            ok: true,
            data: (formattedPosts === null || formattedPosts === undefined) ? [] : formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ ok: false, error: 'Tous les champs sont requis.' });
        }
        //créer un nouveau post
        const newPost = new Post({
            createdAt: Date.now(),
            userId: req.user.userId,
            firstName: user.firstName,
            title: title,
            content: content,
            comments: [],
            upVotes: []
        });
        await newPost.save();
        res.status(201).json({
            ok: true,
            data: newPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        // renvoyer uniquement les posts de l'utilisateur connecter
        const posts = await Post.find({ userId: req.user.userId }).lean().exec();
        res.status(200).json({
            ok: true,
            data: (posts === null || posts === undefined) ? [] : posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}

exports.getPostById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ ok: false, error: 'Paramètres manquant ou invalides' });
        }
        const post = await Post.findById(req.params.id).lean().exec();
        if (!post) {
            return res.status(404).json({ ok: false, error: 'Post non trouvé.' });
        }
        res.status(200).json({
            ok: true,
            data: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}

exports.deletePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ ok: false, error: 'Paramètres manquant ou invalides' });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ ok: false, error: 'Post non trouvé.' });
        }
        if (post.userId !== req.user.userId) {
            return res.status(401).json({ ok: false, error: 'Vous n\'êtes pas autorisé à supprimer ce post.' });
        }
        await post.deleteOne();
        res.status(200).json({
            ok: true,
            error: 'Post supprimé.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}

exports.votePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(422).json({ ok: false, error: 'Paramètres manquant ou invalides' });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ ok: false, error: 'Post non trouvé.' });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ ok: false, error: 'User not found.' });
        }
        if (post.upVotes.includes(req.user.userId)) {
            return res.status(409).json({ ok: false, error: 'User has already voted on this post.' });
        }
        if (user.lastUpVote && (new Date() - user.lastUpVote) < 60 * 1000) {
            return res.status(403).json({ ok: false, error: 'User can only vote every 3 minutes.' });
        }
        // ajouter un vote a l'array de vote du post
        post.upVotes.push(req.user.userId);
        user.lastUpVote = new Date();
        await post.save();
        await user.save();
        res.status(200).json({
            ok: true,
            message: 'Post upvoted.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}

exports.commentPost = async (req, res) => {
    try {
        if (!req.params.id || !req.body.content) {
            return res.status(422).json({ ok: false, error: 'Paramètres manquant ou invalides' });
        }
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        // ajouter un commentaire a l'array de commentaire du post
        post.comments.push({
            id: req.user.userId,
            firstName: user.firstName,
            content: req.body.content
        });
        await post.save();
        res.status(201).json({
            ok: true,
            data: {
                firstName: user.firstName,
                content: req.body.content,
                createdAt: Date.now()
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Erreur interne du serveur.' });
    }
}