

const cookieToken = (user , res)=>{
     //get token
  const token = user.getToken();

  const options = {
    expires: new Date(new Date() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });


}

export default cookieToken;