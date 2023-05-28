const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')
// const db = require('../database/database').getDb


// module.exports = class Products {
//     constructor(id, t, i, p, d) {
//         this._id = id;
//         this.title = t;
//         this.image = i;
//         this.price = p;
//         this.desc = d;
//     }

//     save() {
//         const database = db();
//         let dbOp
//         if (this._id) {
//             dbOp = database.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id)}, { $set: this});
//             console.log("updating " + this.title + this.price)
//         } else {
//             dbOp =  database.collection('products').insertOne(this)
//         }
//         return dbOp.then((results) => {
//             console.log(results);
//             // return results;
//         })
//         .catch((err) => {console.log(err);})
//     }

//     static fetchAll() {
//         const database = db();
//         return database.collection('products')
//         .find()
//         .toArray()
//         .then((products) => {
//             console.log(products[0]);
//             return products;
//         })
//         .catch((err) => {console.log(err);})
//     }

//     static findProducts(id, cb) {
//         const database = db()
//         return database.collection('products')
//         .find({ _id: new mongodb.ObjectId(id)})
//         .next()
//         .then((product) => {console.log(product); return product;})
//         .catch((err) => {console.log(err);})
//     }

//     static delete(id) {
//         const database = db()
//         return database.collection('products').deleteOne({ _id: mongodb.ObjectId(id)})
//             .then((products) => {console.log(products); return products;})
//             .catch((err) => {console.log(err);})
//         // let dbOp
//         // if (id) {
//         //     return database.collection('products').deleteOne({ _id: mongodb.ObjectId(id)})
//         //     .next()
//         //     .then((product) => {console.log(product); return product;})
//         //     .catch((err) => {console.log(err);})
//         // } else {
//         //     console.log('product not found')
//         // }
//         console.log('trying to delete product' + id)
//     }
// }