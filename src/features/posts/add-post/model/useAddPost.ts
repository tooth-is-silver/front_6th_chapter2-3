import { createPosts } from "../../../../entities/posts"
import { usePostDialogs } from "../../../../shared/store"
import type { Post } from "../../../../entities/posts/api/types"
import { useNewPost, usePosts } from "../../model"

export const useAddPost = () => {
  const { newPost, setNewPost } = useNewPost()
  const { posts, setPosts } = usePosts()
  const { setShowAddDialog } = usePostDialogs()

  const addPost = async () => {
    try {
      const response = await createPosts(newPost)
      const data = response.data

      const newPostData: Post = {
        ...data,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      }
      setPosts([newPostData, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return { addPost }
}
