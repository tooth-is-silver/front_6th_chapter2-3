import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, highlightText } from "../../../shared/ui"
import { usePostDialogs, useSearchFilter } from "../../../shared/store"
import { Post } from "../../../entities/posts"

interface PostDetailDialogProps {
  selectedPost: Post
  children: ReactNode
}

export const PostDetailDialog = (props: PostDetailDialogProps) => {
  const { selectedPost, children } = props
  const { searchQuery } = useSearchFilter()
  const { showPostDetailDialog, setShowPostDetailDialog } = usePostDialogs()

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
