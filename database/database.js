const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://arash:lCaO9XaDH3EIT1ZX@cluster0.sm8ldyj.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('connected')
        callback(client)
        _db = client.db()
    })
    .catch(err => {console.log(err);})
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'no database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;