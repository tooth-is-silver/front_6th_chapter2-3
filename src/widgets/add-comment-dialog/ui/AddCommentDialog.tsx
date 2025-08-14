import { Dispatch, SetStateAction } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { NewComment } from "../../../pages/posts/PostsManagerPage"

interface AddCommentDialogProps {
  newComment: NewComment
  setNewComment: Dispatch<SetStateAction<NewComment>>
  showAddCommentDialog: boolean
  setShowAddCommentDialog: Dispatch<SetStateAction<boolean>>
  addComment: () => Promise<void>
}

export const AddCommentDialog = (props: AddCommentDialogProps) => {
  const { newComment, setNewComment, showAddCommentDialog, setShowAddCommentDialog, addComment } = props
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
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
