import type { NextPage } from "next";
import Head from "next/head";
import { Post } from "../components/post";

interface IPosts {
  id: number;
  urlImage?: string;
  title: string;
  description: string;
  author: string;
}

const Home: NextPage = () => {
  const posts: IPosts[] = [
    {
      id: 1,
      title: "Primeira Primeiraeee",
      description:
        "Descrição da primeira imagem Descrição da primeira imagem Descrição da primeira imagem Descrição da primeira imagem",
      author: "Gabriel Marques Marques Marques",
    },
    {
      id: 2,
      title: "Segunda",
      description: "Descrição da segunda",
      author: "Gabriel Marques",
    },
  ];

  return (
    <>
      <Head>
        <title>Favorite | Home</title>
      </Head>
      <main className="Container">
        <h2>Posts</h2>
        <section className="PostsContainer">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;
