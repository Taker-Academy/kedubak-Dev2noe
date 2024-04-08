const mongoose = require('mongoose');
const post_schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        require: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    comments: {
        type: Array,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        id: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        firstName: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
    },
    upVotes: {
        type: Array,
        default: [],
    },
});

const Post = mongoose.model('Post', post_schema);
module.exports = Post