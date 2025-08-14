import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button, highlightText } from "../../../../shared/ui"
import { Comments } from "../../../../entities/comments/api/types"
import { useSearchFilter } from "../../../../shared/store"
import { useSelectedPost } from "../../../posts/model"
import { useComments } from "../../model"
import { useAddComment } from "../../add-comment"
import { useEditComment } from "../../edit-comment"
import { useCommentList } from "../model/useCommentList"

export interface CommentsObj {
  [key: number]: Array<Comments>
}
export const CommentList = () => {
  const { comments } = useComments()
  const { deletePostComment, likeComment } = useCommentList()
  const { addPostComment } = useAddComment()
  const { editPostComment } = useEditComment()
  const { selectedPost } = useSelectedPost()
  const { searchQuery } = useSearchFilter()

  if (!selectedPost) return

  const postId = selectedPost.id

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => addPostComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => editPostComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deletePostComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
