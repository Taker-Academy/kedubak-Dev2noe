const Post = require('../models/postModel.js');
const User = require('../models/userModel.js');

exports.getPosts = async (req, res) => {
    try {
        const post = await Post.find({}).lean().exec();
        if (post.length === 0) {
            return res.status(200).json({
                ok: true,
                data: [] // Renvoie un tableau vide si aucun post n'est trouvé
            });
        }
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
            data: formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Erreur interne du serveur.' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ ok: false, message: 'Tous les champs sont requis.' });
        }
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
        res.status(500).json({ ok: false, message: 'Erreur interne du serveur.' });
    }
}
