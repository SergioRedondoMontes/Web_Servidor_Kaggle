var multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("object");
    const base = "./public/uploads/";
    var id = "hola2";
    var url = base + id;
    fs.mkdir(url, (error) => {
      cb(null, url);
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

exports.uploadSingleFiles = function (filename) {
  return async (req, res, next) => {
    console.log(filename);

    upload.single(filename),
      function (req, res, next) {
        next();
      };
  };
};
