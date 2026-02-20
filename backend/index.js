import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./src/config/db.js";

const app=express();
 
app.get("/",(req,res)=>{
    res.json({message: "server Connected"});
});


const port =process.env.PORT || 5000;

app.listen(port,async ()=>{
    console.log("Server Started at", port);
    connectDB();
});

