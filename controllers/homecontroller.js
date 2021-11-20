const BigPromise = require("../middlewares/bigpromise");
exports.home = BigPromise((req, res) => {
    res.json({
        sucees: true,
        message: "HOME API"
    });
});
exports.homeDummy = (req, res) => {
    res.json({
        sucees: true,
        message: "HOME Dummy API"
    });
}