import { Request, Response } from "express";
import Utils from "../Utils";
import handleError from "../error_handler";
import { db } from "..";
import { collections } from "../db/constants";
import uuid from 'uuid/v1';


/**
 * Generates a temporary token for allowing update requests for a specific game.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { body } = req;

  try {
    Utils.assertParams(['gameSecret'], body);
  } catch (e) {
    return handleError(res, "client", e);
  }

  let { gameSecret } = body;
  let accessToken = uuid().replace(/\-/g, '');

  let match = await db().collection(collections.games).findOneAndUpdate({
    gameSecret
  }, {
      $addToSet: {
        accessTokens: accessToken
      }
    });

  if (!match.ok) {
    //  Game not found or invalid game secret
    return res.status(401).end(JSON.stringify({
      result: 'error',
      error: 'invalidGameSecret'
    }));
  }

  return res.status(201).end(JSON.stringify({
    result: 'ok',
    token: accessToken
  }));
}