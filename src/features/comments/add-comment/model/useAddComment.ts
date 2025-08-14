import { createComments, CreateCommentsRequest } from "../../../../entities/comments"
import { useCommentDialogs } from "../../../../shared/store"
import type { NewComment } from "../ui/AddCommentForm"
import type { CommentsObj } from "../../comment-list/ui/CommentList"
import { SetStateAction } from "react"

export const useAddComment = () => {
  const { setShowAddCommentDialog } = useCommentDialogs()

  const addComment = async (
    newComment: NewComment,
    setComments: (value: SetStateAction<CommentsObj>) => void,
    setNewComment: (value: SetStateAction<CreateCommentsRequest>) => void,
  ) => {
    try {
      const response = await createComments(newComment)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), { ...data, likes: 0 }],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const addPostComment = (postId: number, setNewComment: (value: SetStateAction<CreateCommentsRequest>) => void) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  return { addComment, addPostComment }
}
