const express = require("express"),
       router = express.Router();


router.get("/", (req, res) => {
  //console.log(res.body);
  res.json("Hello World");

});


module.exports = router;
