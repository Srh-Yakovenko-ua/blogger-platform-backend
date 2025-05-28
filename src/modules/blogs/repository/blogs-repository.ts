import { localBlogsDb } from '../local-db/local-blogs-db';
import { BlogType } from '../types/blog.types';
import { generateShortId } from '../../../shared/utils/generate-short-id';

export const blogsRepository = {
  getBlogs() {
    return localBlogsDb;
  },
  getBlogById(blogID: string) {
    return localBlogsDb.find((video) => video.id === blogID);
  },
  createBlog(data: Omit<BlogType, 'id'>) {
    const newBlog: BlogType = {
      id: generateShortId(),
      ...data,
    };
    localBlogsDb.push(newBlog);

    return newBlog;
  },

  updateBlog(data: Omit<BlogType, 'id'>, blogID: string) {
    const findUpdateBlog = localBlogsDb.find((video) => video.id === blogID);
    if (findUpdateBlog) {
      Object.assign(findUpdateBlog, data);
      return findUpdateBlog;
    } else {
      return null;
    }
  },

  deleteBlog(blogID: string) {
    const index = localBlogsDb.findIndex((blog) => blog.id === blogID);
    if (index !== -1) {
      localBlogsDb.splice(index, 1);
      return true;
    } else {
      return null;
    }
  },
};
