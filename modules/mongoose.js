const mongoose = require('mongoose');

const DB_NAME = 'ejournalmoko';
const COLLECTION_NAME = 'Post';

exports.insertPost = async (data, callback) => {

    mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });

    // 'Post' schema
    const postSchema = new mongoose.Schema({
        //_id is auto created by mongodb
        message: String,
        date: String, // but it should by 'Date' type
        category: String, // tech, general, lifestyle, soc med, politics
    });

    // create the database/model/collection/document
    const PostModel = mongoose.model(COLLECTION_NAME, postSchema);

    // create/insert post record
    const post = new PostModel({
        message: data.message,
        date: data.date, 
        category: data.category,
    });
    await post.save().then(() => console.log('New record inserted'));

    // post._id
    callback(post._id);
}

