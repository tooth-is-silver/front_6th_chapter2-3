import { updateComments } from "../../../../entities/comments"
import { useCommentDialogs } from "../../../../shared/store"
import type { Comments } from "../../../../entities/comments/api/types"
import type { CommentsObj } from "../../comment-list/ui/CommentList"
import { SetStateAction } from "react"

export const useEditComment = () => {
  const { setShowEditCommentDialog } = useCommentDialogs()

  const updateComment = async (
    selectedComment: Comments | null,
    setComments: (value: SetStateAction<CommentsObj>) => void,
  ) => {
    if (!selectedComment) return

    try {
      const { id, body } = selectedComment
      const response = await updateComments(id, body)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const editPostComment = (
    comment: Comments,
    setSelectedComment: (value: React.SetStateAction<Comments | null>) => void,
  ) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return { updateComment, editPostComment }
}
