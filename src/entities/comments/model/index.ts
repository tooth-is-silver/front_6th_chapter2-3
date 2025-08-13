import { axiosInstance } from "../../../shared/utils/axios"
import {
  CreateCommentsAddRequest,
  CreateCommentsAddResponse,
  UpdateCommentsRequest,
  UpdateCommentsResponse,
  UpdateCommentsLikesRequest,
  UpdateCommentsLikesResponse,
} from "./types"

export const createCommentsAdd = async (data: CreateCommentsAddRequest) => {
  return axiosInstance.post<CreateCommentsAddResponse>(`/comments/add`, {
    data,
  })
}

export const updateComments = async (commentId: number, data: UpdateCommentsRequest) => {
  return axiosInstance.put<UpdateCommentsResponse>(`/comments/${commentId}`, {
    data,
  })
}

export const updateCommentsLikes = async (commentId: number, data: UpdateCommentsLikesRequest) => {
  return axiosInstance.patch<UpdateCommentsLikesResponse>(`/comments/${commentId}`, {
    data,
  })
}

export const deleteComments = async (commentId: number) => {
  return axiosInstance.delete(`/comments/${commentId}`)
}
