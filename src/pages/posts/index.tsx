import Head from 'next/head';
import styles from './styles.module.scss';
import { createClient } from '../../../prismicio';
import { RichText } from 'prismic-dom';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps){

  return (
    <>
      <Head>
        <title> Posts | Ignews</title>
      </Head>

      <main className={ styles.container }>
        <div className={ styles.posts }>
          { posts.map(post => ( 
            <a key={post.slug} href='#'>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}   
        </div>
      </main>

    </>

  );
}

export async function getStaticProps({previewData}) {
  const client = createClient({previewData});
  const response = await client.getAllByType('post',{
      fetch: ['post.title','post.content'], pageSize: 100
  });
  console.log(response);
  const posts = response.map(post => {
      return {
          slug: post.uid,
          title: RichText.asText(post.data.title),
          excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? '',
          updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
      };
  });

  console.log(posts);
  return {
      props: {
          posts
      },
  }
}