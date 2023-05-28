const Product = require('../models/product')
// const Cart = require('../models/cart')
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const { validationResult } = require('express-validator/check')


exports.addProductGet = (req, res, next) => {
    res.render('admin/edit-product.ejs', 
        {
            pageTitle: 'Add Product',
            current: 'add-product',
            editMode: false,
            isAuth: req.session.isLoggedIn,
            product: {},
            errorMessage: ''
        })
    // const check = req.session.isLoggedIn
    // if (check == true) {
        
    // } else {
    //     res.render('access.ejs', 
    //     { 
    //         pageTitle: '403 Access denied',
    //         current: '',
    //         isAuth: req.session.isLoggedIn
    //     })
    // }
    
}

exports.addProductPost = (req, res, next) => {
    const newTitle = req.body.title
    const newImage = req.file
    const newPrice = req.body.price
    const newDesc = req.body.desc
    console.log(newImage)
    if (!newImage) {
        res.status(422).render('admin/edit-product.ejs', { 
            pageTitle: 'Add Product',
            current: 'add-product',
            editMode: true,
            isAuth: req.session.isLoggedIn,
            product: {
                title: newTitle,
                price: newPrice,
                desc: newDesc,
            },
            errorMessage: 'Image Is not attached'
        })
    }
    const product = new Product({title: newTitle, image: newImage.path, price: newPrice, desc: newDesc, userId: req.user})
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).render('admin/edit-product.ejs', { 
            pageTitle: 'Add Product',
            current: 'add-product',
            editMode: false,
            isAuth: req.session.isLoggedIn,
            product: {
                title: 1,
                price: 1,
                desc: 1,
            },
            errorMessage: errors.array()[0].msg
        })
    }
    product.save()
    .then(res.redirect('admin-dash'))
    .catch((err) => {
        console.log(err)
    })
}

exports.editProductPost = (req, res, next) => {
    console.log('editprodpost')
    const prodId = req.body.prodId
    const updatedtitle = req.body.title
    const newImage = req.file
    const updatedprice = req.body.price
    const updateddesc = req.body.desc
    Product.findOne({_id: prodId.toString()})
    .then(product => {
        product.title = updatedtitle
        console.log(newImage)
        if (newImage) {
            product.image = newImage.path
            console.log('ok')
        }
        product.price = updatedprice,
        product.desc = updateddesc
        // product.userId = product.userId
        product.save()
    })
    .then(res.redirect('/admin/admin-dash'))
    .catch((err) => {
        res.redirect('/500')
      })
}

exports.dashGet = (req, res, next) => {
    Product.find()
        .then((products) => {
            console.log('shop/shop.js', products);
            res.render("admin/admin-dash.ejs", 
            {
                prods: products,
                pageTitle: 'Admin Dash',
                current: 'admin',
                isAuth: req.session.isLoggedIn
            }
            )
        })
        .catch((err) => {
            res.redirect('/500')
        })
    // try {
    //     const check = req.session.isLoggedIn
    //     if (check == true) {
    //         Product.fetchAll()
    //         .then((products) => {
    //         console.log('shop/shop.js', products);
    //         res.render("admin/admin-dash.ejs", 
    //         {
    //             prods: products,
    //             pageTitle: 'Admin Dash',
    //             current: 'admin',
    //             isAuth: req.session.isLoggedIn
    //         }
    //         )
    //         }).catch(err => console.log(err));
    //     } else {
    //         res.render('access.ejs', 
    //         { 
    //             pageTitle: '403 Access denied',
    //             current: '',
    //             isAuth: req.session.isLoggedIn
    //         })
    //     }
    // } catch (error) {
    //     console.log(error)
    // }
    
    
}

exports.editPost = (req, res, next) => {
    console.log('editPost')
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect("/")
    }
    const prodId = req.params.prodId
    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()) {
            res.redirect("/admin/")
            req.flash('error', 'You are not allowed to delete this product')
        }
        res.render('admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editMode: editMode,
            current: 'admin',
            product: product,
            isAuth: req.session.isLoggedIn,
            errorMessage: ''
        });
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/500')
      })
}


exports.deletePost = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(product => {
        if (!product) {
            console.log(prodId)
            return res.redirect('/');
        }
        res.redirect('/admin/admin-dash')
    })
    .catch((err) => {
        res.redirect('/500')
      })
    // delete product then redirect to home
}