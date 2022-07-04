import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Post } from "../../components/post";
import { fauna } from "../../services/faunadb";
import { query as q } from "faunadb";
import { getSession } from "@auth0/nextjs-auth0";

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

const styleH2 = {
  background: "linear-gradient(90deg, var(--purple), var(--red))",
};

const MyPosts = ({ posts }: IPosts) => {
  return (
    <>
      <Head>
        <title>My Posts | Home</title>
      </Head>
      <main className="Container">
        <h2 style={styleH2}>Meus Posts</h2>
        <section className="PostsContainer">
          {posts.map((post) => (
            <Post key={post.id["@ref"].id} {...post} page="myPosts" />
          ))}
        </section>
      </main>
    </>
  );
};

export default MyPosts;

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
  const session = getSession(req, res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const postsDB: IPostsDB = await fauna.query(
    //mapeando os posts
    q.Map(
      q.Paginate(q.Match(q.Index("posts_by_creator"), session.user.email), {
        //quantidade a ser carregada
        size: 50,
      }),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  console.log(postsDB.data);

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
