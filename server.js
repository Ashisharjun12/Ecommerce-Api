import app from "./src/app.js";
import { _config } from "./src/config/config.js";
import connectDb from "./src/config/db.js";




const startServer = async()=>{
    const port =_config.PORT || 8000

    //connect to database
    await connectDb()


    app.get("/" , (req, res)=>{
        console.log("server is running....")
    })


    app.listen(port , ()=>{
        console.log(`server is running at ${port}`)
    })


}


startServer()