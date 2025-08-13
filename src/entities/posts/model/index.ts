import { axiosInstance } from "../../../shared/utils/axios"
import { CreatePostsRequest, CreatePostsResponse, UpdatePostsRequest, UpdatePostsResponse } from "./types"

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
