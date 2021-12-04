module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login')
    }
  },

  ensureAdmin: (req, res, next) => {
    if(req.isAuthenticated) {
      if(req.user.tipo === "admin") {
        return next();
      } else {
        res.redirect("/dashboard")  
      }
    } else {
      res.redirect("/")
    }
  },
  
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  },
}
