export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type CommentDBType = {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CreateCommentDTO = {
  content: string;
  postId: string;
};

export type UpdateCommentDTO = {
  content: string;
  commentId: string;
};
