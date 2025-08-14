import { Dispatch, SetStateAction } from "react"
import { CreatePostsRequest } from "../../../../entities/posts"
import { usePostDialogs } from "../../../../shared/store"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../../shared/ui"

export type NewPost = CreatePostsRequest

interface AddPostFormProps {
  newPost: NewPost
  setNewPost: Dispatch<SetStateAction<NewPost>>
  addPost: () => Promise<void>
}
export const AddPostForm = (props: AddPostFormProps) => {
  const { newPost, setNewPost, addPost } = props
  const { showAddDialog, setShowAddDialog } = usePostDialogs()

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
