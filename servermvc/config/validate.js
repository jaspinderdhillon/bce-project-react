var jwt = require("jsonwebtoken");
function ValidateTokenn2(req, resp, next) {
    const full_token = req.headers['authorization'];

    
    if(!full_token){
        resp.json({ status: false, msg: "You are not authenticated!" });
        return;
    }
    var ary = full_token.split(" ");
    var actualtoken = ary[1];
    let istokenvalid;


    try {
        istokenvalid = jwt.verify(actualtoken, process.env.SEC_KEY);

        if (istokenvalid != null) {
            const payload = jwt.decode(ary[1]);
            console.log("payload is " + JSON.stringify(payload));
            next();
        } else {
            resp.json({ status: false, msg: "You are not authenticated!" });
        }
    } catch (err) {
        resp.json({ status: false, msg: err.message });
        return;
    }
}

module.exports = { ValidateTokenn2 };
