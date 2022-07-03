import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineLoading } from "react-icons/ai";
import { BsPersonBoundingBox } from "react-icons/bs";

import style from "./style.module.scss";

interface PerfilModalProps {
  open: boolean;
  functionClose: () => void;
}

export const PerfilModal = ({
  open = false,
  functionClose,
}: PerfilModalProps) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleLogin = () => router.push("/api/auth/login");
  const handleLogOut = () => router.push("/api/auth/logout");

  return (
    <div
      onClick={functionClose}
      className={`${style.background} ${open || isLoading ? style.open : ""}`}
    >
      <div
        className={style.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {!user && (
          <div className={style.modalLogin}>
            <h2>
              Para ter acesso total a aplicação <br />
              crie sua conta - <strong>rápido e fácil</strong>
            </h2>
            {isLoading && (
              <button className={style.loading}>
                <AiOutlineLoading />
              </button>
            )}
            {!isLoading && <button onClick={handleLogin}>Login</button>}
          </div>
        )}
        {user && (
          <div className={style.modalPerfil}>
            <h2>Hey {user.name}</h2>
            <div className={style.img}>
              <BsPersonBoundingBox />
            </div>
            <div className={style.asideButtons}>
              <div>
                !<span>Email {user.email}</span>
              </div>
              <div>
                <Link href="/myPosts">
                  <a onClick={functionClose}>
                    My <br />
                    Posts
                  </a>
                </Link>
              </div>
            </div>
            {isLoading && (
              <button className={style.loading}>
                <AiOutlineLoading />
              </button>
            )}
            {!isLoading && <button onClick={handleLogOut}>Logout</button>}
          </div>
        )}
      </div>
    </div>
  );
};
