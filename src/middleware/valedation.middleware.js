export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abotrEarly: false });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map((err) => {
        return err.message;
      });

      return next(new Error(errorMessages));
    }

    return next();
  };
};
