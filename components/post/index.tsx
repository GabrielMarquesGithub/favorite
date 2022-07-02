import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

import style from "./style.module.scss";

interface PostProps {
  urlImage?: string;
  title: string;
  description: string;
  author: string;
}

export const Post = ({
  urlImage = "https://picsum.photos/400/400",
  title,
  description,
  author,
}: PostProps) => {
  const [selected, setSelected] = useState(false);
  const [warning, setWarning] = useState(false);

  const { user } = useUser();

  const handleSelected = () => setSelected(!selected);
  const handleNotLogin = () => {
    if (!user) {
      setWarning(true);
      setTimeout(() => {
        setWarning(false);
      }, 2000);
      return;
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
        <h3>{author}</h3>
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
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <span className={style.footerMenu}>
          <span onClick={handleNotLogin}>
            <BsHeart />
          </span>
          <span onClick={handleNotLogin}>
            <CgClose />
          </span>
        </span>
      </footer>
    </div>
  );
};
