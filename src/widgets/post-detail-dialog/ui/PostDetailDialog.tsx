import { Dispatch, ReactNode, SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, highlightText } from "../../../shared/ui"
import { SelectedPost } from "../../../pages/posts/PostsManagerPage"

interface PostDetailDialogProps {
  showPostDetailDialog: boolean
  setShowPostDetailDialog: Dispatch<SetStateAction<boolean>>
  selectedPost: SelectedPost
  searchQuery: string
  children: ReactNode
}

export const PostDetailDialog = (props: PostDetailDialogProps) => {
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost, searchQuery, children } = props

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
