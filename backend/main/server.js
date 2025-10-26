import express from "express"
import pg from "pg"
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { Pool } from 'pg';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config();


const PROTO_PATH = path.resolve('./greeter.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const greeterProto = grpc.loadPackageDefinition(packageDefinition).greeter;

// Define the service method
function sayHello(call, callback) {
  const name = call.request.name;
  callback(null, { message: `wsg, ${name}!` });
}

// Start the gRPC server
const grpcServer = new grpc.Server();
grpcServer.addService(greeterProto.Greeter.service, { SayHello: sayHello });
grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server running on port 50051');
});

console.log("Express server started")
const app = express()
app.get('/', (req,res)=>{
    res.send("Hello")
})


