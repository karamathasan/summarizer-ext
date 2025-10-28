import {Pool} from "pg"
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

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

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'summarizerDB',
  password: '2463',
  port: 5432,
});

// async function getUsers() {
//   try {
//     const res = await pool.query('SELECT * FROM users');
//     console.log(res.rows);
//   } catch (err) {
//     console.error('Error executing query', err.stack);
//   }
// }

async function addUser(){
  try {
    const res = await pool.query('INSERT INTO users');
    console.log(res.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}
