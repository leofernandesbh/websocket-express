import express, { Application } from 'express'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'

class App {
  private app: Application;
  private httpServer: http.Server;
  private ioServer: Server;

  get http() {
    return this.httpServer
  }

  get io() {
    return this.ioServer
  }
  
  listenServer() {    
    this.httpServer.listen(3000, () => {
      console.log('🚀 Server is running on port 3000');
    });
  }

  constructor() {
    this.app = express();

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.httpServer = http.createServer(this.app);
    this.ioServer = new Server(this.httpServer);
  }
}

export const app = new App()




