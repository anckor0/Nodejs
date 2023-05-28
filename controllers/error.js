exports.notFound = (req, res, next) => {
    res.status(404).render('404.ejs', 
    {
        pageTitle: '404', current: '', 
        // isAuth: req.session.isLoggedIn
    });
}

exports.serverError = (req, res, next) => {
    res.status(500).render('500.ejs',
    {
        pageTitle: 'Error Occured', current: '',
    })
}

