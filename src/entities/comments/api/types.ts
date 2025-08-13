export interface Comments {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export interface CommentsPostData {
  comments: Array<Comments>
  total: number
  skip: number
  limit: number
}

export interface CreateCommentsAddRequest {
  body: string
  postId: number
  userId: number
}

export interface CreateCommentsAddResponse {
  body: string
  id: number
  postId: number
  user: { id: number; username: string; fullName: string }
}

export interface UpdateCommentsRequest {
  body: string
}

export interface UpdateCommentsResponse extends CreateCommentsAddResponse {
  likes: number
}

export interface UpdateCommentsLikesRequest {
  likes: number
}

export interface UpdateCommentsLikesResponse extends CreateCommentsAddResponse {
  likes: number
}
