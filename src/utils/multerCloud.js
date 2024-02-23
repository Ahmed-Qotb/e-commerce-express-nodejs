import multer, { diskStorage } from "multer";

const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    // console.log("here");

    // ? check mimetype
    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("invalid format !!"));
    }
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};

export { fileUpload };
