import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import { sequelize } from './dbConnection';
import * as cors from "cors";
import { Message } from './message.model';
import { MessageController } from './message.controller';

export enum ChatEvent {
  MESSAGE = 'message',
  LIST_MESSAGES = 'listMessages'
};

type SocketDefaultResult = "ok";
type SocketDefaultError = string;
type SocketResponse<
  Res = SocketDefaultResult,
  Err = SocketDefaultError
  > = {
    res?: Res;
    err?: Err;
  };

type SocketCallback<
  Res = SocketDefaultResult,
  Err = SocketDefaultError
  > = (res: SocketResponse<Res, Err>) => void;


interface ChatMessageIncoming {
  id: string;
  userId: string;
  text: string;
  username: string;
}

interface ChatMessage extends ChatMessageIncoming {
  createdAt: Date;
  status: "receivedByServer";
}

interface ListMessagesResponse {
  items: ChatMessage[];
}

export class ChatServer {
  public static readonly PORT: number = 8090;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private messageController: MessageController = new MessageController();
  constructor() {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
        this.createModels();
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  private createModels() {
    Message.sync({ force: true }).then(console.log);

  }

  private initSocket(): void {
    this.io = socketIo(this.server, { path: '/chat' });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on("connect", (socket: socketIo.Socket) => {
      console.log('Connected client on port %s.', this.port);
      socket.on("*", (mes) => {
        console.log(mes)
      })
      socket.on(ChatEvent.MESSAGE, (m: ChatMessageIncoming) => {
        console.log(m)
        const savedMessage: ChatMessage = {
          ...m,
          createdAt: new Date(),
          status: "receivedByServer"
        }
        return this.messageController.saveMessage(savedMessage).then(() => {


          this.io.emit('message', savedMessage);
        })

      });

      socket.on(ChatEvent.LIST_MESSAGES, (cb: SocketCallback<ListMessagesResponse>) => {
        console.log(cb)
        return this.messageController.getMessageList().then((result) => {
          let listOfMessage = result.map((message: any) => {
            return message.dataValues
          })

          cb({
            res: {
              items: listOfMessage.slice().reverse()
            }
          })
        })

      });

      socket.on("disconnected", () => {
        console.log('Client disconnected');
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}