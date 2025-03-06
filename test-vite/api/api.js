import express from "express"

const server = express();   

const port = 3010;

server.use("/api/0.1",(req,res)=>{
    res.send("Hello World")
})

server.listen(port, () =>{
    console.log(`Example App listening on Port ${port}`)
})