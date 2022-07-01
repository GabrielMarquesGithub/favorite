import { NextPage } from "next";
import Head from "next/head";

const Favorite: NextPage = () => {
  return (
    <>
      <Head>
        <title>Favorite | Favorite</title>
      </Head>
      <main className="Container">
        <h2>Posts Favoritados</h2>
        <section className="PostsContainer"></section>
      </main>
    </>
  );
};
export default Favorite;
