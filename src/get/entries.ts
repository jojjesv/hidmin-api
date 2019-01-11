import { Request, Response } from "express";
import { db } from "..";
import { collections } from "../db/constants";
import {
  ObjectID
} from 'mongodb';

/**
 * Outputs score entries for a specific game.
 * @author Johan Svensson
 */
export default async function (req: Request, res: Response) {
  let { params } = req;
  let { gameId } = params;

  //  Convert to object ID
  try {
    gameId = new ObjectID(gameId);
  } catch (e) {
    //  Silently fail
  }

  let gameMatch = await db().collection(
    collections.games
  ).findOne({ $or: [{ _id: gameId }, { gameSecret: gameId }] });

  if (!gameMatch) {
    return res.status(400).end(JSON.stringify({
      result: 'error', error: `unknown game with id: ${gameId}`
    }));
  }

  let entries = await db().collection(
    collections.scoreEntries
  ).find({ gameId }).toArray();

  entries.forEach(e => {
    e.id = e._id;
    delete e._id;
  })

  return res.json({ entries });
}