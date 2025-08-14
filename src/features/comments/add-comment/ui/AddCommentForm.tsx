import { Dispatch, SetStateAction } from "react"
import { CreateCommentsRequest } from "../../../../entities/comments"
import { useCommentDialogs } from "../../../../shared/store"
import { DialogHeader, Textarea, Button, Dialog, DialogContent, DialogTitle } from "../../../../shared/ui"

export type NewComment = CreateCommentsRequest

interface AddCommentFormProps {
  newComment: NewComment
  setNewComment: Dispatch<SetStateAction<NewComment>>
  addComment: (newComment: NewComment) => Promise<void>
}

export const AddCommentForm = (props: AddCommentFormProps) => {
  const { newComment, setNewComment, addComment } = props
  const { showAddCommentDialog, setShowAddCommentDialog } = useCommentDialogs()

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={() => addComment(newComment)}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
