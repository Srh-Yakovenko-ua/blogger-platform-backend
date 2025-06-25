import { BlogType } from '../types/blog.types';
import { blogsCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';

// db logic
export const blogsRepository = {
  async getBlogs() {
    return await blogsCollections.find().toArray();
  },
  async getBlogById(blogID: string): Promise<WithId<BlogType> | null> {
    const objectID = new ObjectId(blogID);
    return blogsCollections.findOne({ _id: objectID });
  },
  async createBlog(data: BlogType): Promise<InsertOneResult<BlogType>> {
    return await blogsCollections.insertOne(data);
  },

  async updateBlog(data: BlogType, blogID: string): Promise<boolean> {
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
