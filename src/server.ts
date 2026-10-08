import express from "express";
import routes from "./routes";

class Server {

    public app: any;

    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use("/api/v1", routes);
    }

    listen(port: number) {
        this.app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }
}

export default Server;