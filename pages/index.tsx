import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Post } from "../components/post";
import { fauna } from "../services/faunadb";
import { query as q } from "faunadb";

interface IPosts {
  posts: {
    id: { ["@ref"]: { id: number; collection: { ["@ref"]: { id: string } } } };
    userEmail: string;
    author: string;
    title: string;
    description: string;
    likes: number;
  }[];
}

const Home = ({ posts }: IPosts) => {
  return (
    <>
      <Head>
        <title>Favorite | Home</title>
      </Head>
      <main className="Container">
        <h2>Posts</h2>
        <section className="PostsContainer">
          {posts.map((post) => (
            <Post key={post.id["@ref"].id} id={post.id} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  interface dataDB {
    ref: string;
    data: {};
  }
  interface IPostsDB {
    data: dataDB[];
  }

  const postsDB: IPostsDB = await fauna.query(
    //mapeando os posts
    q.Map(
      q.Paginate(q.Match(q.Index("all_posts")), {
        //quantidade a ser carregada
        size: 9,
      }),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );
  // para correção do tipo JSON
  const postsData: dataDB[] = await JSON.parse(JSON.stringify(postsDB.data));

  const posts = [...postsData.map((post) => ({ id: post.ref, ...post.data }))];
  return {
    props: {
      posts: posts,
    },
  };
};
