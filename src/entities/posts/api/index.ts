import { axiosInstance } from "../../../shared/utils/axios"
import {
  getPostsParams,
  PostsData,
  PostsTags,
  CreatePostsRequest,
  UpdatePostsRequest,
  CreatePostsResponse,
  UpdatePostsResponse,
} from "./types"

export const getPosts = async (params: getPostsParams) => {
  const searchParams = new URLSearchParams({
    limit: params.limit?.toString() ?? "0",
    skip: params.skip ?? "0",
  })

  return axiosInstance.get<PostsData>(`/posts?${searchParams}`)
}

export const getPostsTags = async () => {
  return axiosInstance.get<Array<PostsTags>>(`/posts/tags`)
}

export const getPostsTagTagName = async (tagName: string) => {
  return axiosInstance.get(`/posts/tag/${tagName}`)
}

export const getPostsSearch = async (q: string) => {
  const searchParams = new URLSearchParams({
    q: q ?? "",
  })

  return axiosInstance.get<PostsData>(`/posts/search?${searchParams}`)
}

export const createPosts = async (data: CreatePostsRequest) => {
  return axiosInstance.post<CreatePostsResponse>(`/api/posts/add`, {
    data,
  })
}

export const updatePosts = async (postId: number, data: UpdatePostsRequest) => {
  return axiosInstance.put<UpdatePostsResponse>(`/api/posts/${postId}`, {
    data,
  })
}

export const deletePosts = async (postId: number) => {
  return axiosInstance.delete(`/api/posts/${postId}`)
}
