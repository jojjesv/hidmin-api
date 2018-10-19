import { Request, Response } from "express";
import Utils from "../Utils";
import handleError from "../error_handler";
import { db } from "..";
import { collections } from "../db/constants";

let lastMatch;

/**
 * Checks a request's authorization.
 * A request is authorized if a valid token is passed as a query parameter
 * in the form of "token=<token>".
 * @author Johan Svensson
 * @returns Whether the request was authorized, otherwise handled.
 */
export default async (req: Request, res: Response):
  Promise<false | AuthResult> => {
  let { query } = req;
  try {
    Utils.assertParams(['token'], query);
  } catch (e) {
    handleError(res, "client", "Provide a 'token' query parameter.");
    return false;
  }

  let { token } = query;

  let match = await db().collection(collections.games).findOne({
    accessTokens: {
      $elemMatch: {
        $eq: token
      }
    }
  });

  if (!match) {
    res.status(403).end(JSON.stringify({
      result: 'error',
      error: 'invalidToken'
    }));
    return false;
  }

  //  Authorized
  return {
    game: match
  } as AuthResult;
}

export class AuthResult {
  game: any;
}