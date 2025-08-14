import { Dispatch, SetStateAction } from "react"
import { Comments } from "../../../../entities/comments"
import { useCommentDialogs } from "../../../../shared/store"
import { DialogHeader, Textarea, Button, Dialog, DialogContent, DialogTitle } from "../../../../shared/ui"

interface EditCommentFormProps {
  selectedComment: Comments | null
  setSelectedComment: Dispatch<SetStateAction<Comments | null>>
  updateComment: (selectedComment: Comments | null) => Promise<void>
}

export const EditCommentForm = (props: EditCommentFormProps) => {
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
          <Button onClick={() => updateComment(selectedComment)}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
