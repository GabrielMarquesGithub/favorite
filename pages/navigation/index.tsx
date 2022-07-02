import { useState } from "react";
import { BsStars } from "react-icons/bs";
import Link from "next/link";
import { IoMdPhotos } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { TbFaceId } from "react-icons/tb";
import { LinkActive } from "../../components/linkActive";
import { NextPage } from "next";
import { PerfilModal } from "../../components/perfilModal";
import { useUser } from "@auth0/nextjs-auth0";

import styles from "./style.module.scss";
import { PostCreateModal } from "../../components/postCreateModal";

const Navigation: NextPage = () => {
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [perfilMenuOpen, setPerfilMenuOpen] = useState(false);
  const [postCreateOpen, setPostCreateOpen] = useState(false);

  const handleOpen = () => setMenuOpen(!menuOpen);
  const handlePerfilMenuChange = () => setPerfilMenuOpen(!perfilMenuOpen);
  const handleCreateModalOpen = () => setPostCreateOpen(!postCreateOpen);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navBar}>
          <Link href="/">
            <a className={styles.logo}>
              <h1>
                <BsStars />
                Favorite
              </h1>
            </a>
          </Link>
          <div
            className={`${styles.dropDownMenu} ${
              menuOpen ? styles.openMenu : ""
            }`}
          >
            <div onClick={handleOpen} className={styles.iconMenu}>
              <div> </div>
              <div> </div>
              <div> </div>
            </div>
            <div className={styles.linksContainer}>
              <LinkActive href="/" activeClass={styles.active}>
                <a onClick={handleOpen}>
                  <IoMdPhotos />
                  Photos
                </a>
              </LinkActive>
              <LinkActive href="/favorite" activeClass={styles.active}>
                <a onClick={handleOpen}>
                  <BsBookmarkStarFill />
                  Favorites
                </a>
              </LinkActive>
              <span
                onClick={() => {
                  handleOpen();
                  handlePerfilMenuChange();
                }}
              >
                <TbFaceId />
                Perfil
              </span>
              {user && (
                <span
                  onClick={() => {
                    handleOpen();
                    handleCreateModalOpen();
                  }}
                  className={styles.buttonCreatePost}
                >
                  +
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      <PerfilModal
        open={perfilMenuOpen}
        functionClose={handlePerfilMenuChange}
      />
      <PostCreateModal
        open={postCreateOpen}
        functionClose={handleCreateModalOpen}
      />
    </>
  );
};
export default Navigation;
