import { Db, MongoClient } from "mongodb";

/**
 * Inits the database driver.
 * @author Johan Svensson
 */
export default (): Promise<Db> => new Promise(async (resolve, reject) => {
  console.log("Setting up mongodb driver...");
  MongoClient.connect('mongodb://localhost:27017/hidmin', {
  }, (e, d) => {
    if (e) {
      console.log("mongodb driver init error!", e);
      process.exit(-1);
    } else {
      resolve(d.db('hidmin'))
    }
  });
});