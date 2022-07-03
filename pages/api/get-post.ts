import { fauna } from "../../services/faunadb";
import { query as q } from "faunadb";
import { NextRequest } from "next/server";
import { NextApiResponse } from "next";

interface IncrementProps {
  ref: number;
  collection: string;
}
interface dataDB {
  ref: string;
  data: {};
}
interface IPostsDB {
  data: dataDB[];
}
export default async function likeFauna(
  req: NextRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body: IncrementProps = req.body as any;
    try {
      const postsDB: IPostsDB = await fauna.query(
        q.Get(q.Ref(q.Collection(body.collection), body.ref))
      );
      res.json({ body: postsDB.data });
    } catch (err) {
      console.log("fauna error: ", err);
    }
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
}
