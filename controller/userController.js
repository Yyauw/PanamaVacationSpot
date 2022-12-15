const User = require("../models/user");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to PanamaVacationSpot!");
      res.redirect("/spots");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.registerForm = (req, res) => {
  res.render("./user/register");
};

module.exports.loginForm = (req, res) => {
  res.render("./user/login");
}

module.exports.login = (req, res) => {
  const backUrl = req.session.backTo || "/spots";
  delete req.session.backTo;
  req.flash("success", "Welcome back!");
  res.redirect(backUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/spots");
  });
};
