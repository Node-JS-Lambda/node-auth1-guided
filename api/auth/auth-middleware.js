function restricted(req, res, next) {
  console.log("Restricting access to authed users only!");
  next();
}

module.exports = {
  restricted,
};
