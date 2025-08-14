import { Dispatch, SetStateAction } from "react"
import { SelectedPost } from "../../../pages/posts/PostsManagerPage"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

interface EditPostDialogProps {
  selectedPost: SelectedPost
  setSelectedPost: Dispatch<SetStateAction<SelectedPost>>
  showEditDialog: boolean
  setShowEditDialog: Dispatch<SetStateAction<boolean>>
  updatePost: () => Promise<void>
}

export const EditPostDialog = (props: EditPostDialogProps) => {
  const { selectedPost, setSelectedPost, showEditDialog, setShowEditDialog, updatePost } = props

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
