import { fauna } from "../../services/faunadb";
import { query as q } from "faunadb";
import { NextRequest } from "next/server";
import { NextApiResponse } from "next";

interface IncrementProps {
  ref: number;
  collection: string;
  value: number;
}
export default async function deletePost(
  req: NextRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body: IncrementProps = req.body as any;
    try {
      await fauna.query(
        q.Delete(q.Ref(q.Collection(body.collection), body.ref))
      );
      res.status(200).json({ success: "Delete" });
    } catch (err) {
      console.log("fauna error: ", err);
    }
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
}
