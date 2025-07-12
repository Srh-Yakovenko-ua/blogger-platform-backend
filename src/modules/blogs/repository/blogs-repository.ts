import { BlogType } from '../types/blog.types';
import { blogsCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId } from 'mongodb';

// db logic
export const blogsRepository = {
  async createBlog(data: BlogType): Promise<InsertOneResult<BlogType>> {
    return await blogsCollections.insertOne(data);
  },

  async updateBlog(data: Partial<BlogType>, blogID: string): Promise<boolean> {
    const updateBlogResult = await blogsCollections.updateOne(
      { _id: new ObjectId(blogID) },
      { $set: { ...data } },
    );
    return updateBlogResult.matchedCount >= 1;
  },

  async deleteBlog(blogID: string): Promise<boolean> {
    const deleteBlogResult = await blogsCollections.deleteOne({
      _id: new ObjectId(blogID),
    });
    return deleteBlogResult.deletedCount >= 1;
  },
};
