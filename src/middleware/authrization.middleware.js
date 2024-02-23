const isAuthrized = (...roles) => {
  return (req, res, next) => {
    // ? getting role from auth middleware
    const user = req.user;

    // ? checking or role
    if (!roles.includes(user.role)) {
      return next(new Error("unauthrized accesss"));
    }

    return next();
  };
};
export { isAuthrized };
