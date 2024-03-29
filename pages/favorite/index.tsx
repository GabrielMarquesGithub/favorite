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
  noUser: boolean;
}

const Favorite = ({ posts, noUser = false }: IPosts) => {
  return (
    <>
      <Head>
        <title>Favorite | Home</title>
      </Head>
      <main className="Container">
        {noUser ? (
          <h2>Faça login para favoritar algo!!</h2>
        ) : (
          <h2>Posts Favoritados</h2>
        )}
        <section className="PostsContainer">
          {!noUser &&
            posts.map((post) => (
              <Post key={post.id["@ref"].id} {...post} page="favorite" />
            ))}
        </section>
      </main>
    </>
  );
};

export default Favorite;

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
      props: {
        noUser: true,
      },
    };
  }

  const postsDB: IPostsDB = await fauna.query(
    //mapeando os posts
    q.Map(
      q.Paginate(
        q.Match(q.Index("post_by_favorite_email"), session.user.email),
        {
          //quantidade a ser carregada
          size: 50,
        }
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  // para correção do tipo JSON
  const postsData: dataDB[] = await JSON.parse(JSON.stringify(postsDB.data));

  const posts = [
    ...postsData.map((post) => ({
      id: post.ref,
      //verificando a existência do favorite
      favorite: post.data.favorites.some(
        (email) => email === session.user.email
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
