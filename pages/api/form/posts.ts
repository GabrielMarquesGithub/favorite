import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../../services/faunadb";
import { query as q } from "faunadb";

interface reqBody {
  userEmail: string;
  author: string;
  title: string;
  description: string;
}

export default function posts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body: reqBody = { ...req.body, likes: 0 };

    try {
      fauna.query(
        q.Create(q.Collection("posts"), {
          data: body,
        })
      );
      res.status(200).json({ success: "Post Criado" });
    } catch (err) {
      console.log("Error: ", err);
    }
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
}
