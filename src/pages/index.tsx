import type { NextPage } from "next";
import Head from "next/head";
import { Post } from "../components/post";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Favorite | Home</title>
      </Head>
      <main className="Container">
        <h2>Posts</h2>
        <section className="PostsContainer">
          <Post />
        </section>
      </main>
    </>
  );
};

export default Home;
