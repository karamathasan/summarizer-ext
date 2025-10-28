import express from "express"
import pg from "pg"
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { Pool } from 'pg';
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
// const jwt = require("jsonwebtoken")

import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const PROTO_PATH = path.resolve('./greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const greeterProto = grpc.loadPackageDefinition(packageDefinition).greeter;

// Create a client connected to the server
const client = new greeterProto.Greeter('localhost:50051', grpc.credentials.createInsecure());

// Make a request
client.SayHello({ name: 'Karamat' }, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Greeting:', response.message);
  }
});


const port = 3000
const app = express()
app.use(express.json())
app.get('/', (req,res)=>{
    res.send("Hello")
})

app.post("/login", async (req,res)=>{
  const username = req.body.username
  // authentication
  const user = null; //retreive user from DB

  const password = req.body.password
  try {
    if (await bcrypt.compare(req.body.password, user.password)){
      res.send("Success")
    } else {
      res.send("Invalid Username or Password")
    }
  } catch {
    res.status(500).send()
  }

  const accessToken = jwt.sign({name: username}, process.env.ACCESS_TOKEN_SECRET)
  res.json({accessToken: accessToken})

})

app.post("/signup",async (req,res)=>{
  try{
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = {username: req.body.username, password: hashedPassword}
  } catch {
    res.status(500).send()
  }

  // add user info to DB

})

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null){
    return res.sendStatus(401)
  }
}

app.listen(port, ()=>{
  console.log(`Express app listening on port ${port}`)
})


