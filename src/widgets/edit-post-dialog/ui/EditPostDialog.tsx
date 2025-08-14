import { Dispatch, SetStateAction } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { usePostDialogs } from "../../../shared/store"
import { Post } from "../../../entities/posts"

interface EditPostDialogProps {
  selectedPost: Post
  setSelectedPost: Dispatch<SetStateAction<Post | null>>
  updatePost: (selectedPost: Post) => Promise<void>
}

export const EditPostDialog = (props: EditPostDialogProps) => {
  const { selectedPost, setSelectedPost, updatePost } = props
  const { showEditDialog, setShowEditDialog } = usePostDialogs()

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={() => updatePost(selectedPost)}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
