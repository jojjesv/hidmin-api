import { Request, Response } from "express";
import handleError from "../error_handler";
import Utils from "../Utils";
import { db } from "..";
import { collections } from "../db/constants";
import uuid from 'uuid/v1';

/**
 * Posts a new game.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { body } = req;
  try {
    Utils.assertParams(['title'], body);
  } catch (e) {
    return handleError(res, "client", e);
  }

  let { title } = body;

  //  Created game secret
  let gameSecret = 'gs_' + title.substr(0, 2).toLowerCase() + uuid().replace(/\-/g, '');

  let match = await db().collection(collections.games).findOne({
    $or: [{
      title
    }, {
      gameSecret
    }]
  });
  if (match) {
    return res.status(401).end(JSON.stringify({
      result: 'error',
      error: 'gameAlreadyExists'
    }))
  }

  let insert = await db().collection(collections.games).insertOne({
    title,
    gameSecret
  });
  if (!insert.result.ok) {
    return handleError(res, "server");
  }

  return res.status(201).end(JSON.stringify({
    result: 'ok',
    gameId: insert.insertedId.toHexString(),
    gameSecret
  }))
}