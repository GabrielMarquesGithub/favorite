import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { memo, useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { api } from "../../services/api";
import { useRouter } from "next/router";

import style from "./style.module.scss";

interface PostProps {
  page: string;
  likes: number;
  urlImage?: string;
  title: string;
  description: string;
  author: string;
  id: { ["@ref"]: { id: number; collection: { ["@ref"]: { id: string } } } };
  favorite: boolean;
}

const PostComponent = ({
  page,
  urlImage,
  id,
  author,
  title,
  description,
  likes,
  favorite,
}: PostProps) => {
  //simular tamanho de fotos
  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [selected, setSelected] = useState(favorite);
  const [warning, setWarning] = useState(false);
  const [post, setPost] = useState({
    urlImage: `https://picsum.photos/400/${randomInteger(200, 300)}`,
    id,
    author,
    title,
    description,
    likes,
  });

  const ref = {
    ref: id["@ref"].id,
    collection: id["@ref"].collection["@ref"].id,
  };

  const router = useRouter();
  const { user } = useUser();

  const handleLike = async (value: number) => {
    setPost({ ...post, likes: post.likes + value });

    const data = {
      ...ref,
      value: value,
    };
    // transformando os dados em JSON
    const JSONdata = JSON.stringify(data);
    // opções para o envio
    const headers = {
      "Content-Type": "application/json",
    };
    // enviando requisições POST com o axios
    await api.post("/like", JSONdata, { headers });
  };
  const handleDelete = async () => {
    const data = ref;
    // transformando os dados em JSON
    const JSONdata = JSON.stringify(data);
    // opções para o envio
    const headers = {
      "Content-Type": "application/json",
    };
    // enviando requisições POST com o axios
    await api.post("/delete", JSONdata, { headers });

    router.reload();
  };
  const handleFavorite = async () => {
    handleSelected();
    const data = {
      ...ref,
      email: user?.email,
    };
    // transformando os dados em JSON
    const JSONdata = JSON.stringify(data);
    // opções para o envio
    const headers = {
      "Content-Type": "application/json",
    };
    // enviando requisições POST com o axios
    await api.post("/favorite", JSONdata, { headers });
  };

  //para formatação de valores para o like
  const likesFormat = (likes: number) => {
    const likesString = String(Math.abs(likes));
    const digits = String(Math.abs(likes)).length;
    if (digits < 4) return likes;
    if (digits >= 4 && digits < 7)
      return `${likesString.slice(0, digits - 3)}Mil`;
    if (digits >= 7 && digits < 10)
      return `${likesString.slice(0, digits - 6)}Mi`;
    if (digits >= 10 && digits < 13)
      return `${likesString.slice(0, digits - 9)}Bi`;
    if (likes >= 13) return `Infinite`;
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

  return (
    <div className={style.PostContainer}>
      {warning && (
        <div className={style.warning}>
          <span>Voce deve realizar login para utilizar as ferramentas</span>
        </div>
      )}
      <header>
        <h3>{post.author}</h3>
        <span onClick={() => (handleNotLogin() ? handleFavorite() : "")}>
          {selected ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      </header>
      <Image
        loader={() => post.urlImage}
        src={post.urlImage}
        alt="teste"
        layout="responsive"
        width={400}
        height={200}
      />
      <footer>
        <div className={style.footerText}>
          <h4>{post.title}</h4>
          <p>{post.description}</p>
        </div>
        {page === "myPosts" && (
          <span className={style.footerMenuPersonal}>
            <span>{likesFormat(post.likes)}</span>
            <span onClick={handleDelete}>
              <CgClose />
            </span>
          </span>
        )}
        {(page === "home" || page === "favorite") && (
          <span className={style.footerMenuHome}>
            <span className={style.likes}>{likesFormat(post.likes)}</span>
            <div>
              <span onClick={() => (handleNotLogin() ? handleLike(1) : null)}>
                <FaArrowAltCircleUp />
              </span>
              <span onClick={() => (handleNotLogin() ? handleLike(-1) : null)}>
                <FaArrowAltCircleDown />
              </span>
            </div>
          </span>
        )}
      </footer>
    </div>
  );
};
export const Post = memo(PostComponent, (prevProps, nextProps) => {
  //object.id compara profundamento objetos, porem requer muito, cuidado com objetos complexos
  return Object.is(prevProps, nextProps);
});
