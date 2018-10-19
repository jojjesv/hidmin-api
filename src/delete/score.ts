import { Request, Response } from "express";
import checkAccessToken from "../auth/auth_access_token";
import handleError from "../error_handler";
import Utils from "../Utils";
import { db } from "..";
import { collections } from "../db/constants";
import { ObjectId } from "bson";
import score from "../post/score";

/**
 * Deletes a specific score.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let authResult;
  if (!(authResult = await checkAccessToken(req, res))) {
    return;
  }

  let { params } = req;
  try {
    Utils.assertParams([ 'scoreId' ], params);
  } catch (e) {
    return handleError(res, 'client', e);
  }

  let { scoreId } = params;

  let result = await db().collection(collections.scoreEntries).findOneAndDelete({
    _id: new ObjectId(scoreId),
    gameId: authResult.game._id
  });

  if (!result.value) {
    //  Score not found or cross referenced game
    return res.status(401).end(JSON.stringify({
      result: 'error',
      error: 'invalidScoreId'
    }));
  }

  //  OK
  return res.status(200).end(JSON.stringify({
    result: 'ok',
    byebye: scoreId
  }));
}