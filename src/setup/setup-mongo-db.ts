import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb';
import { PostType } from '../modules/posts/types/post-types';
import { BlogType } from '../modules/blogs/types/blog.types';
import { UserDBType, UserType } from '../modules/users/types/user-types';

export let postsCollections: Collection<PostType>;
export let blogsCollections: Collection<BlogType>;
export let usersCollections: Collection<UserDBType>;
export async function runDB(url: string): Promise<void> {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  const db = client.db('blog-platform');
  blogsCollections = db.collection<BlogType>('blogs');
  postsCollections = db.collection<PostType>('posts');
  usersCollections = db.collection<UserDBType>('users');
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
