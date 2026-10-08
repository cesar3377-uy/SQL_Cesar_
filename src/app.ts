import dotenv from "dotenv";
import Server from "./server";

dotenv.config();

const port: number = Number(process.env.PORT) || 3000;

const server: any = new Server();

server.listen(port);