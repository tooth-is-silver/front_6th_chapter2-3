import { Dispatch, SetStateAction } from "react"
import { Comments } from "../../../entities/comments"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useCommentDialogs } from "../../../shared/store"

interface EditCommentDialogProps {
  selectedComment: Comments | null
  setSelectedComment: Dispatch<SetStateAction<Comments | null>>
  updateComment: () => Promise<void>
}

export const EditCommentDialog = (props: EditCommentDialogProps) => {
  const { selectedComment, setSelectedComment, updateComment } = props
  const { showEditCommentDialog, setShowEditCommentDialog } = useCommentDialogs()

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
