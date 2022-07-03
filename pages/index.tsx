import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Post } from "../components/post";
import { fauna } from "../services/faunadb";
import { query as q } from "faunadb";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

interface IPosts {
  posts: {
    id: { ["@ref"]: { id: number; collection: { ["@ref"]: { id: string } } } };
    userEmail: string;
    author: string;
    title: string;
    description: string;
    likes: number;
    favorite: boolean;
  }[];
}

const Home = ({ posts }: IPosts) => {
  const [showNumber, setShowNumber] = useState(9);
  const [postsAppearing, setPostsAppearing] = useState(
    posts.slice(0, showNumber)
  );

  useEffect(() => {
    setPostsAppearing(posts.slice(0, showNumber));
  }, [showNumber, posts]);

  return (
    <>
      <Head>
        <title>Favorite | Home</title>
      </Head>
      <main className="Container">
        <h2>Posts</h2>
        <section className="PostsContainer">
          {postsAppearing.map((post) => (
            <Post key={post.id["@ref"].id} {...post} page="home" />
          ))}
          {showNumber < posts.length && (
            <div className="containerButtonShowMore">
              <button onClick={() => setShowNumber(showNumber + 9)}>
                Mostrar Mais
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  interface dataDB {
    ref: string;
    data: {
      favorites: [];
    };
  }
  interface IPostsDB {
    data: dataDB[];
  }

  const postsDB: IPostsDB = await fauna.query(
    //mapeando os posts
    q.Map(
      q.Paginate(q.Match(q.Index("all_posts")), {
        //quantidade a ser carregada
        size: 100,
      }),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  const session = getSession(req, res);
  // para correção do tipo JSON
  const postsData: dataDB[] = await JSON.parse(JSON.stringify(postsDB.data));

  const posts = [
    ...postsData.map((post) => ({
      id: post.ref,
      favorite: post.data.favorites.some(
        (email) => email === session!.user.email
      ),
      ...post.data,
    })),
  ];
  return {
    props: {
      posts: posts,
    },
  };
};
