import { useUser } from "@auth0/nextjs-auth0";
import React, { useRef } from "react";
import { api } from "../../services/api";

import style from "./style.module.scss";

export interface PerfilModalProps {
  open: boolean;
  functionClose: () => void;
}

export const PostCreateModal = ({
  open = false,
  functionClose,
}: PerfilModalProps) => {
  const { user } = useUser();

  const authorRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      userEmail: user?.email,
      author: authorRef.current?.value,
      title: titleRef.current?.value,
      description: descriptionRef.current?.value,
    };

    // transformando os dados em JSON
    const JSONdata = JSON.stringify(data);

    // opções para o envio
    const headers = {
      "Content-Type": "application/json",
    };

    // enviando requisições POST com o axios
    await api.post("/form/posts", JSONdata, { headers });

    authorRef.current!.value = user?.name as string;
    titleRef.current!.value = "";
    descriptionRef.current!.value = "";

    functionClose();
  };

  return (
    <div
      onClick={functionClose}
      className={`${style.background} ${open ? style.open : ""}`}
    >
      <div
        className={style.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          Eae o que vai <strong>postar ?</strong>
        </h2>

        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            ref={authorRef}
            name="author"
            type="text"
            maxLength={40}
            defaultValue={user?.name as string}
            required
            placeholder="Autor"
          />
          <input
            ref={titleRef}
            name="title"
            type="text"
            maxLength={20}
            required
            placeholder="Titulo"
          />
          <h3>Descrição</h3>
          <textarea
            ref={descriptionRef}
            name="description"
            cols={20}
            rows={10}
            required
            maxLength={500}
          ></textarea>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};
