import { Dispatch, SetStateAction } from "react"
import { Comments } from "../../../entities/comments"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"

interface EditCommentDialogProps {
  selectedComment: Comments | null
  setSelectedComment: Dispatch<SetStateAction<Comments | null>>
  showEditCommentDialog: boolean
  setShowEditCommentDialog: Dispatch<SetStateAction<boolean>>
  updateComment: () => Promise<void>
}

export const EditCommentDialog = (props: EditCommentDialogProps) => {
  const { selectedComment, setSelectedComment, showEditCommentDialog, setShowEditCommentDialog, updateComment } = props

  if (!selectedComment) return

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
