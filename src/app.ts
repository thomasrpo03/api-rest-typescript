import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

//Routes
import indexRoutes from "./routes/index.routes";
import agentsRoutes from "./routes/agents.routes";
import clientsRoutes from "./routes/clients.routes";
import authRoutes from "./routes/auth.routes";

export class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", this.port || process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(morgan(`dev`));
    this.app.use(express.json());
    this.app.use(cors());
  }

  routes() {
    this.app.use("/api/auth",authRoutes)
    this.app.use("/api", indexRoutes);
    this.app.use("/api", agentsRoutes);
    this.app.use("/api", clientsRoutes);
  }

  async listen() {
    await this.app.listen(this.app.get("port"));
    console.log(`Server on port: `, this.app.get("port"));
  }
}
