import { fauna } from "../../services/faunadb";
import { query as q } from "faunadb";
import { NextRequest } from "next/server";
import { NextApiResponse } from "next";

interface IncrementProps {
  ref: number;
  collection: string;
}
export default async function likeFauna(
  req: NextRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body: IncrementProps = req.body as any;
    try {
      await fauna.query(
        q.Update(q.Ref(q.Collection(body.collection), body.ref), {
          data: {
            likes: q.Add(
              q.Select(
                ["data", "likes"],
                q.Get(q.Ref(q.Collection(body.collection), body.ref))
              ),
              1
            ),
          },
        })
      );
      res.status(200).json({ success: "Like" });
    } catch (err) {
      console.log("fauna error: ", err);
    }
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
}
