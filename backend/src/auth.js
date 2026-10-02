const jwt=require("jsonwebtoken"),db=require("./db");
const secret=process.env.JWT_SECRET||"dev-secret";
function sign(u){return jwt.sign({id:u.id,role:u.role,phone:u.phone},secret,{expiresIn:"30d"})}
function auth(roles=[]){return(req,res,next)=>{try{const h=req.headers.authorization||"";if(!h.startsWith("Bearer "))return res.status(401).json({error:"AUTH_REQUIRED"});const p=jwt.verify(h.slice(7),secret);const u=db.prepare("SELECT * FROM users WHERE id=?").get(p.id);if(!u)return res.status(401).json({error:"USER_NOT_FOUND"});if(roles.length&&!roles.includes(u.role))return res.status(403).json({error:"FORBIDDEN"});req.user=u;next()}catch(e){res.status(401).json({error:"INVALID_TOKEN"})}}}
module.exports={sign,auth};