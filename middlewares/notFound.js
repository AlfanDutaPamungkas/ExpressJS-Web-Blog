const notFound = (req, res, next) => {
    res.status(404).render('errors/notFound');
}

module.exports = notFound;