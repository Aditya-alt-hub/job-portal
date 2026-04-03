import jwt from "jsonwebtoken";

const auth=async (req,res,next)=>
{
    try
    {
        const token = req.cookies.token;
        if(!token)
        {
            return res.status(401).json(
                {
                    message:"User not Authenticated",
                    success:false,
                }
            );
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode)
        {
            return res.status(401).json(
                {
                    message:"token invalid",
                    success:false,
                }
            );
        }
        req.id=decode.userId;
        req.role = decode.role;
        next();

    }
    catch(error)
    {
        console.log(error);
    }
}
// export const authorizeRoles = (...roles)=> (req,res,next)=>{
//   if(!roles.includes(req.role)){
//     return res.status(403).json({message:"Access denied"});
//   }
//   next();
// };
export const authorizeRoles = (...roles) => (req, res, next) => {
  console.log("Allowed Roles:", roles);
  console.log("User Role:", req.role);

  if (!req.role || !roles.includes(req.role.toLowerCase().trim())) {
    return res.status(403).json({
      message: "Access denied"
    });
  }

  next();
};
export default auth;