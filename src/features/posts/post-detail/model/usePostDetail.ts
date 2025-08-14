import { usePostDialogs } from "../../../../shared/store"
import type { PostsWithUsers } from "../../post-list/ui/PostList"
import type { CommentsObj } from "../../../comments/comment-list/ui/CommentList"
import { SetStateAction } from "react"
import { Post } from "../../../../entities/posts"

export const usePostDetail = () => {
  const { setShowPostDetailDialog } = usePostDialogs()

  const openPostDetail = (
    post: PostsWithUsers,
    setSelectedPost: (value: SetStateAction<Post | null>) => void,
    fetchComments: (
      postId: number,
      comments: CommentsObj,
      setComments: (value: SetStateAction<CommentsObj>) => void,
    ) => void,
    comments: CommentsObj,
    setComments: (value: SetStateAction<CommentsObj>) => void,
  ) => {
    setSelectedPost(post)
    fetchComments(post.id, comments, setComments)
    setShowPostDetailDialog(true)
  }

  return { openPostDetail }
}
