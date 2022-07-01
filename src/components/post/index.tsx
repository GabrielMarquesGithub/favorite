import Image from "next/image";
import { useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

import style from "./style.module.scss";

interface PostProps {
  urlImage?: string;
}

export const Post = ({ urlImage }: PostProps) => {
  const [selected, setSelected] = useState(false);

  const handleSelected = () => setSelected(!selected);

  const src = "https://picsum.photos/400/400";

  return (
    <div className={style.PostContainer}>
      <header>
        <h3>Titulo Titulo Titulo Titulo</h3>
        <span onClick={handleSelected}>
          {selected ? <AiFillStar /> : <AiOutlineStar />}
        </span>
      </header>
      <Image
        loader={() => src}
        src={src}
        alt="teste"
        layout="responsive"
        width={400}
        height={400}
      />
      <footer>
        <p>Descrição</p>
        <span className={style.footerMenu}>
          <span>
            <BsHeart />
          </span>
          <span>
            <CgClose />
          </span>
        </span>
      </footer>
    </div>
  );
};
