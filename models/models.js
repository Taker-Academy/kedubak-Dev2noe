const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    lastUpVote: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 1);
            return now;
        },
    },
});

const User = mongoose.model('User', user_schema);

const commentSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const postSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);

module.exports = { User, Post };