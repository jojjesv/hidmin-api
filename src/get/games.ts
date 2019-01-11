import { Request, Response } from "express";
import { db } from "..";
import { collections } from "../db/constants";

/**
 * Outputs all games and their score entries.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let games = await db().collection(collections.games).aggregate([{
    $lookup: {
      from: collections.scoreEntries,
      localField: '_id',
      foreignField: 'gameId',
      as: 'scoreEntries'
    }
  }]).toArray();

  games = games.map(g => {
    let entries = g.scoreEntries.map(entry => {
      return {
        id: entry._id,
        score: entry.score,
        name: entry.name,
        date: entry.date
      }
    });

    entries.sort((a: any, b: any) => b.score - a.score);

    return {
      title: g.title,
      secret: g.gameSecret,
      entries
    }
  });

  return res.status(200).end(JSON.stringify({
    result: 'ok',
    games
  }))
}