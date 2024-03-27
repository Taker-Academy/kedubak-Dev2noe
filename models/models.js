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
module.exports = User;