import { useState } from "react";
import { BsStars } from "react-icons/bs";
import Link from "next/link";
import { IoMdPhotos } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { TbFaceId } from "react-icons/tb";

import styles from "./style.module.scss";
import { LinkActive } from "../../components/linkActive";
import { NextPage } from "next";

const Navigation: NextPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpen = () => setMenuOpen(!menuOpen);

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
                <a>
                  <IoMdPhotos />
                  Photos
                </a>
              </LinkActive>
              <LinkActive href="/favorite" activeClass={styles.active}>
                <a>
                  <BsBookmarkStarFill />
                  Favorites
                </a>
              </LinkActive>
              <LinkActive href="/perfil" activeClass={styles.active}>
                <a>
                  <TbFaceId />
                  Perfil
                </a>
              </LinkActive>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Navigation;
