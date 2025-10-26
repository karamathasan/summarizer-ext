import {Pool} from "pg"
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load the .proto definition
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
