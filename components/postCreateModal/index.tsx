import { useUser } from "@auth0/nextjs-auth0";
import style from "./style.module.scss";

interface PerfilModalProps {
  open: boolean;
  functionClose: () => void;
}

export const PostCreateModal = ({
  open = false,
  functionClose,
}: PerfilModalProps) => {
  const { user } = useUser();

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

        <form>
          <input
            name="author"
            type="text"
            maxLength={40}
            defaultValue={user?.name as string}
            required
            placeholder="Autor"
          />
          <input
            name="title"
            type="text"
            maxLength={20}
            required
            placeholder="Titulo"
          />
          <h3>Descrição</h3>
          <textarea
            name="description"
            cols={20}
            rows={10}
            required
            maxLength={200}
          ></textarea>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};
