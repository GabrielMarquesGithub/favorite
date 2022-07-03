import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { api } from "../../services/api";

import style from "./style.module.scss";

interface PostProps {
  likes?: number;
  urlImage?: string;
  title?: string;
  description?: string;
  author?: string;
  id: { ["@ref"]: { id: number; collection: { ["@ref"]: { id: string } } } };
}
interface dataDB {
  ref: string;
  data: {};
}
interface IPostsDB {
  data: dataDB[];
}

export const Post = ({
  urlImage = "https://picsum.photos/400/400",
  id,
}: PostProps) => {
  const [selected, setSelected] = useState(false);
  const [warning, setWarning] = useState(false);
  const [post, setPost] = useState<PostProps | null>(null);

  const [update, setUpdate] = useState(false);

  const { user } = useUser();

  const ref = useMemo(
    () => ({
      ref: id["@ref"].id,
      collection: id["@ref"].collection["@ref"].id,
    }),
    [id]
  );

  useEffect(() => {
    const fetchFunc = async () => {
      const data = ref;
      // transformando os dados em JSON
      const JSONdata = JSON.stringify(data);
      // opções para o envio
      const headers = {
        "Content-Type": "application/json",
      };
      // enviando requisições POST com o axios
      const res = await api.post("/get-post", JSONdata, { headers });
      const resBody = await JSON.parse(res.data);
      setPost({ ...resBody.body });
    };
    fetchFunc();
  }, [ref, update]);

  const handleLike = async () => {
    const data = ref;
    // transformando os dados em JSON
    const JSONdata = JSON.stringify(data);
    // opções para o envio
    const headers = {
      "Content-Type": "application/json",
    };
    // enviando requisições POST com o axios
    await api.post("/like", JSONdata, { headers });
    setUpdate(!update);
  };

  const handleSelected = () => setSelected(!selected);
  const handleNotLogin = () => {
    if (!user) {
      setWarning(true);
      setTimeout(() => {
        setWarning(false);
      }, 2000);
      return false;
    }
    return true;
  };

  console.log(post);

  return (
    <div className={style.PostContainer}>
      {warning && (
        <div className={style.warning}>
          <span>Voce deve realizar login para utilizar as ferramentas</span>
        </div>
      )}
      <header>
        <h3>{post?.author}</h3>
        <span onClick={() => (handleNotLogin() ? handleSelected() : "")}>
          {selected ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      </header>
      <Image
        loader={() => urlImage}
        src={urlImage}
        alt="teste"
        layout="responsive"
        width={400}
        height={400}
      />
      <footer>
        <div>
          <h4>{post?.title}</h4>
          <p>{post?.description}</p>
        </div>
        <span className={style.footerMenu}>
          <span onClick={() => (handleNotLogin() ? handleLike() : "")}>
            <BsHeart />
            <strong>{post?.likes}</strong>
          </span>
          <span onClick={handleNotLogin}>
            <CgClose />
          </span>
        </span>
      </footer>
    </div>
  );
};
