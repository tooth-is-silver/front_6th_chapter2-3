import { updatePosts } from "../../../../entities/posts"
import { usePostDialogs } from "../../../../shared/store"
import type { Post } from "../../../../entities/posts/api/types"
import { SetStateAction } from "react"
import { PostsWithUsers } from "../../post-list"

export const useEditPost = () => {
  const { setShowEditDialog } = usePostDialogs()

  const updatePost = async (selectedPost: Post, posts: Post[], setPosts: (value: SetStateAction<Post[]>) => void) => {
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

  const deletePost = async (postId: number, posts: Post[], setPosts: (value: SetStateAction<Post[]>) => void) => {
    try {
      const { deletePosts } = await import("../../../../entities/posts")
      await deletePosts(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const openEditDialog = (
    selectedPost: PostsWithUsers,
    setSelectedPost: (value: SetStateAction<Post | null>) => void,
  ) => {
    setSelectedPost(selectedPost)
    setShowEditDialog(true)
  }

  return { updatePost, deletePost, openEditDialog }
}
