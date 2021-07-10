
const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

exports.run = async (fn) => {
    try {
        await client.connect();

        const database = client.db('ejournalmokoDB');
        const posts = database.collection('posts');

        // Query for a movie that has the title 'Back to the Future'
        // const query = { title: 'Back to the Future' };
        const cursor = await posts.find();
        
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        let msgs =[]
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(d => {
            // console.log('data = ' + d.message);
            msgs.push(d.message);
        });

        fn(msgs);
        
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}