  import express from "express";
  import cors from "cors";
  import bodyParser from "body-parser";
  import { MongoClient } from "mongodb";
  
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(cors());
  
  async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://ajith24ram:Ajith24rAm@jsmastry.v2yaeh1.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
  
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
