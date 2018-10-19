import { Request, Response } from "express";
import Utils from "../Utils";
import handleError from "../error_handler";
import checkAccessToken from "../auth/auth_access_token";
import { db } from "..";
import { collections } from "../db/constants";
import { ObjectId } from "bson";

/**
 * Posts a new score entry.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { body } = req;

  let authResult;
  if (!(authResult = await checkAccessToken(req, res))) {
    return;
  };

  try {
    Utils.assertParams([ 'score' ], body, { 'score': 'number' });
  } catch (e) {
    return handleError(res, 'client', e);
  }

  let { score, name } = body;

  let insert = await db().collection(collections.scoreEntries).insertOne({
    gameId: authResult.game._id,
    score: score,
    name: name,
    date: new Date()
  });

  if (!insert.result.ok) {
    return handleError(res, 'server');
  }

  return res.status(201).end(JSON.stringify({
    result: 'ok',
    scoreId: insert.insertedId.toHexString(),
  }));
}