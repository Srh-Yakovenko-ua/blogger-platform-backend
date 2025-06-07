import { BlogType } from '../types/blog.types';
import { blogsCollections } from '../../../setup/setup-mongo-db';
import { ObjectId, OptionalId } from 'mongodb';
import { outputBlogData } from '../utils/output-blog-data';

export const blogsRepository = {
  async getBlogs() {
    return await blogsCollections
      .find()
      .toArray()
      .then((blogs) => blogs.map(outputBlogData));
  },
  async getBlogById(blogID: string): Promise<BlogType | null> {
    const objectID = new ObjectId(blogID);
    return blogsCollections.findOne({ _id: objectID }).then((blog) => {
      if (blog) return outputBlogData(blog);
      else return null;
    });
  },
  async createBlog(data: Omit<BlogType, 'id'>): Promise<BlogType | null> {
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const newBlogInsert = await blogsCollections.insertOne(
      dataWithTimestamp as OptionalId<BlogType>,
    );
    return await this.getBlogById(newBlogInsert.insertedId.toString());
  },

  async updateBlog(data: Omit<BlogType, 'id'>, blogID: string) {
    const updateBlogResult = await blogsCollections.updateOne(
      { _id: new ObjectId(blogID) },
      { $set: { ...data } },
    );
    return updateBlogResult.matchedCount >= 1;
  },

  async deleteBlog(blogID: string) {
    const deleteBlogResult = await blogsCollections.deleteOne({
      _id: new ObjectId(blogID),
    });
    return deleteBlogResult.deletedCount >= 1;
  },
};
