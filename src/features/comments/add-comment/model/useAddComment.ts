import { createComments } from "../../../../entities/comments"
import { useCommentDialogs } from "../../../../shared/store"
import { useComments, useNewComment } from "../../model"

export const useAddComment = () => {
  const { newComment, setNewComment } = useNewComment()
  const { setComments } = useComments()
  const { setShowAddCommentDialog } = useCommentDialogs()

  const addComment = async () => {
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

  const addPostComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  return { addComment, addPostComment }
}
