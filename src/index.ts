/**
 * Hidmin API starts here.
 * @author Johan Svensson
 */
import express, { Response, Request } from 'express';
import mongodb from 'mongodb';
import initDb from './db/init';
import cors from 'cors';

let _db: mongodb.Db;
export const db = () => _db;

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  port: 8003
};

initDb().then(db => {
  _db = db;
  app.listen(config.port, () => console.log(`API listening on port ${config.port}!`));
});

/**
 * Accepts any request but returns a 405 response if the method mismatches.
 */
const handleWith405 = (req: Request, res: Response, method: 'get' | 'post' | 'put' | 'delete',
  handler: (req: Request, res: Response) => any) => {

  console.log("Method", method, req.method);
  if (req.method.toLowerCase() != method.toLowerCase()) {
    //  Method not allowed
    return res.status(405).end(JSON.stringify({
      result: 'error',
      message: `${req.method} method not allowed`
    }));
  }

  return handler(req, res);
}

/**
 * Accepts any requests but returns a 405 response if the method mismatches.
 * @param handlers An object of handlers mapped to their respective method, e.g. { "post": require(...) }
 */
const handleMultipleWith405 = (req: Request, res: Response, handlers: object) => {
  let methods = Object.keys(handlers);

  for (let method of methods) {
    let m = method.toLowerCase();
    if (req.method.toLowerCase() == m) {
      return handlers[m](req, res);
    }
  }

  return res.status(405).end(JSON.stringify({
    result: 'error',
    message: `${req.method} method not allowed`
  }));
}

const baseApiUrl = `/api`;
app.all(`${baseApiUrl}/games`, (req, res) => handleWith405(req, res, 'get', require('./get/games').default));
app.all(`${baseApiUrl}/game`, (req, res) => handleWith405(req, res, 'post', require('./post/game').default));
app.all(`${baseApiUrl}/game/token`, (req, res) => handleWith405(req, res, 'post', require('./post/token').default));
app.all(`${baseApiUrl}/games/:gameId`, (req, res) => handleWith405(req, res, 'get', require('./get/entries').default));
app.all(`${baseApiUrl}/score`, (req, res) => handleMultipleWith405(req, res, {
  'post': require('./post/score').default
}));

app.all(`${baseApiUrl}/score/:scoreId`, (req, res) =>
  handleWith405(req, res, 'delete', require('./delete/score').default));