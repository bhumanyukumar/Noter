const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("./pages/home", { title: "Home" });
})
router.get("/about", (req, res) => {
    res.render("./pages/about", { title: "About" })
})
module.exports = router;