import { BlogType } from '../types/blog.types';

import { ObjectId, WithId } from 'mongodb';
import { blogsCollections } from '../../../setup/setup-mongo-db';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const blogQueryRepository = {
  async getBlogById(blogID: string): Promise<WithId<BlogType> | null> {
    const objectID = new ObjectId(blogID);
    return blogsCollections.findOne({ _id: objectID });
  },

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
};
