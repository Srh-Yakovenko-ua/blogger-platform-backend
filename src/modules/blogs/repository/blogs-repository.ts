import { BlogType } from '../types/blog.types';
import { blogsCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

// db logic
export const blogsRepository = {
  async getBlogs(filtersQuery: PaginationQueryType): Promise<{
    blogs: WithId<BlogType>[];
    totalCountBlogs: number;
  }> {
    const { searchNameTerm, pageSize, pageNumber, sortBy, sortDirection } = filtersQuery;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const blogs = await blogsCollections
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCountBlogs = await blogsCollections.countDocuments(filter);

    return { blogs, totalCountBlogs };
  },
  async getBlogById(blogID: string): Promise<WithId<BlogType> | null> {
    const objectID = new ObjectId(blogID);
    return blogsCollections.findOne({ _id: objectID });
  },
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
