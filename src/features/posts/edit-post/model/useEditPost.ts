import { updatePosts } from "../../../../entities/posts"
import { usePostDialogs } from "../../../../shared/store"
import type { Post } from "../../../../entities/posts/api/types"
import { usePosts, useSelectedPost } from "../../model"

export const useEditPost = () => {
  const { posts, setPosts } = usePosts()
  const { setSelectedPost } = useSelectedPost()
  const { setShowEditDialog } = usePostDialogs()

  const updatePost = async (selectedPost: Post) => {
    if (!selectedPost) return
    try {
      const response = await updatePosts(selectedPost.id, selectedPost)
      const data = response.data

      const updatedPost: Post = {
        ...data,
        views: selectedPost.views,
      }
      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const deletePost = async (postId: number) => {
    try {
      const { deletePosts } = await import("../../../../entities/posts")
      await deletePosts(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const openEditDialog = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  return { updatePost, deletePost, openEditDialog }
}
