import { SetStateAction } from "react"
import {
  getCommentsPost,
  deleteComments,
  updateCommentsLikes,
  UpdateCommentsLikesRequest,
} from "../../../../entities/comments"
import type { CommentsObj } from "../ui/CommentList"
import { useComments } from "../../model"

export const useCommentList = () => {
  const { comments, setComments } = useComments()

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await getCommentsPost(postId)
      const data = response.data
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  const deletePostComment = async (commentId: number, postId: number) => {
    try {
      await deleteComments(commentId)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const likeComment = async (commentId: number, postId: number) => {
    try {
      const body: UpdateCommentsLikesRequest = {
        likes:
          comments[postId] && comments[postId].find((c) => c.id === commentId)
            ? comments[postId].find((c) => c.id === commentId)!.likes + 1
            : 1,
      }
      const response = await updateCommentsLikes(commentId, body)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return {
    fetchComments,
    deletePostComment,
    likeComment,
  }
}
