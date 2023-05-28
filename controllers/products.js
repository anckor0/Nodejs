const Product = require('../models/product')
const User = require('../models/users')
const Order = require('../models/orders')
// const Cart = require('../models/cart')

exports.shopGet = (req, res, next) => {
  Product.find()
  .then((products) => {
    console.log('shop/shop.js', products);
    res.render("shop/shop.ejs", 
    {
      prods: products,
      pageTitle: 'Shop',
      current: 'shop',
      isAuth: req.session.isLoggedIn
    }
    )
  }).catch((err) => {
    res.redirect('/500')
  })
}

exports.productGet = (req, res, next) => {
  const prodId = req.params.prodId
  Product.findById(prodId)
  .then(product => {
      if (!product) {
          console.log(prodId)
          return res.redirect('/product');
      }
      res.render('product-details.ejs', {
          pageTitle: "Shop | " + product.title,
          productImage: product.image,
          productTitle: product.title,
          current: 'products',
          product: product,
          isAuth: req.session.isLoggedIn
      });
  })
  .catch((err) => {
    res.redirect('/500')
  })
}

exports.indexGet = (req, res, next) => {
  res.render("index.ejs",
  {
    pageTitle: 'Home Page',
    current: 'home',
    isAuth: req.session.isLoggedIn
  })
}

exports.cartGet = (req, res, next) => {
  console.log(req.user.cart.items)
  const products = req.user.cart.items
  // req.user.cart.productId
    res.render("cart.ejs",
    {
      pageTitle: 'Cart',
      current: 'cart',
      products: products,
      isAuth: req.session.isLoggedIn
    })
  .catch((err) => {
    res.redirect('/500')
  })
}

exports.cartPost = (req, res, next) => {
  const prodId = req.body.productId
  console.log("id " + prodId)
  Product.findById(prodId)
  .then(product => {return req.user.addToCart(product)})
  .then(results => 
    res.redirect('/cart')
  )
  .catch((err) => {
    res.redirect('/500')
    console.log(err)
  })
}

exports.ordersGet = (req, res, next) => {
  res.render("orders.ejs",
  {
    pageTitle: 'Orders',
    current: 'orders',
    isAuth: req.session.isLoggedIn
  })
}

exports.ordersPost = (req, res) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products,
      userId: user._id
    })
    return order.save()
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
  });
}