import { createPosts, CreatePostsRequest } from "../../../../entities/posts"
import { usePostDialogs } from "../../../../shared/store"
import type { NewPost } from "../ui/AddPostForm"
import type { Post } from "../../../../entities/posts/api/types"
import { Dispatch, SetStateAction } from "react"
import { PostsWithUsers } from "../../post-list"

export const useAddPost = () => {
  const { setShowAddDialog } = usePostDialogs()

  const addPost = async (
    newPost: NewPost,
    posts: Post[],
    setPosts: Dispatch<SetStateAction<Array<PostsWithUsers>>>,
    setNewPost: (value: SetStateAction<CreatePostsRequest>) => void,
  ) => {
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
