import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui"
import {
  createPosts,
  deletePosts,
  getPosts,
  getPostsParams,
  getPostsSearch,
  getPostsTags,
  getPostsTagTagName,
  Post,
  PostsData,
  PostsTags,
  updatePosts,
} from "../../entities/posts"
import { getUserInfo, getUsers, getUsersData, getUsersParams, UserInfo } from "../../entities/users"
import {
  AddPostDialog,
  EditPostDialog,
  Pagination,
  PostTable,
  PostComments,
  AddCommentDialog,
  EditCommentDialog,
  PostDetailDialog,
  UserDialog,
  PostsWithUsers,
  NewPost,
  NewComment,
  PostCommentsObj,
} from "../../widgets"
import { Comments } from "../../entities/comments/api/types"
import {
  usePagination,
  useSearchFilter,
  useLoading,
  usePostDialogs,
  useCommentDialogs,
  useUserDialog,
} from "../../shared/store"
import {
  createComments,
  deleteComments,
  getCommentsPost,
  updateComments,
  updateCommentsLikes,
  UpdateCommentsLikesRequest,
} from "../../entities/comments"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 상태 관리
  const [posts, setPosts] = useState<Array<Post>>([])
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  // 전역 상태 훅 사용
  const { skip, setSkip, limit, setLimit, setTotal } = usePagination()
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag, sortBy, setSortBy, sortOrder, setSortOrder } =
    useSearchFilter()
  const { loading, setLoading } = useLoading()
  const { setShowAddDialog, setShowEditDialog, setShowPostDetailDialog } = usePostDialogs()
  const { setShowAddCommentDialog, setShowEditCommentDialog } = useCommentDialogs()
  const { setShowUserDialog } = useUserDialog()

  // 로컬 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Array<PostsTags>>([])
  const [comments, setComments] = useState<PostCommentsObj>({})
  const [selectedComment, setSelectedComment] = useState<Comments | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const fetchPosts = async (limit: number, skip: number) => {
    const params: getPostsParams = {
      limit,
      skip: skip.toString(),
    }
    const response = await getPosts(params)
    return response.data
  }

  const fetchUsers = async () => {
    const params: getUsersParams = {
      limit: 0,
      select: "username,image",
    }
    const response = await getUsers(params)
    return response.data
  }

  // 게시물 가져오기
  const loadData = async () => {
    try {
      setLoading(true)
      const postsRes = await fetchPosts(limit, skip)
      const usersRes = await fetchUsers()
      const { users: usersData } = usersRes

      const postsWithUsers = postsRes.posts.map((post) => ({
        ...post,
        author: usersData.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsRes.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await getPostsTags()
      const data = response.data
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      loadData()
      return
    }
    setLoading(true)
    try {
      const response = await getPostsSearch(searchQuery)
      const data = response.data
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tagName: string) => {
    if (!tagName || tagName === "all") {
      loadData()
      return
    }
    setLoading(true)
    try {
      const [postsTagTagNameRes, usersRes] = await Promise.all([
        getPostsTagTagName(tagName),
        getUsers({
          limit: 0,
          select: "username,image",
        }),
      ])
      const postsData = postsTagTagNameRes.data as PostsData
      const usersData = usersRes.data as getUsersData

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
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

  // 게시물 업데이트
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

  // 게시물 삭제
  const deletePost = async (postId: number) => {
    try {
      await deletePosts(postId)
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await getCommentsPost(postId)
      const data = response.data
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await createComments(newComment)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), { ...data, likes: 0 }],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return

    try {
      const { id, body } = selectedComment
      const response = await updateComments(id, body)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deletePostComment = async (commentId: number, postId: number) => {
    try {
      await deleteComments(commentId)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (commentId: number, postId: number) => {
    try {
      const body: UpdateCommentsLikesRequest = {
        likes:
          comments[postId] && comments[postId].find((c) => c.id === commentId)
            ? comments[postId].find((c) => c.id === commentId)!.likes + 1
            : 1,
      }
      const response = await updateCommentsLikes(commentId, body)
      const data = response.data
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostsWithUsers) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (userId: number) => {
    try {
      const response = await getUserInfo(userId)
      const userData = response.data
      // setState부분은 useMutation에서 onSuccess로 전달
      setSelectedUser(userData)
      setShowUserDialog(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  const filteredPostTag = (tagName: string) => {
    setSelectedTag(tagName)
    updateURL()
  }

  const openEditDialog = (selectedPost: PostsWithUsers, isEditDialog: boolean) => {
    setSelectedPost(selectedPost)
    setShowEditDialog(isEditDialog)
  }

  const addPostComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  const editPostComment = (comment: Comments) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      loadData()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // URL 파라미터 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              selectedTag={selectedTag}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
              deletePost={deletePost}
              filteredPostTag={filteredPostTag}
              openEditDialog={openEditDialog}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog newPost={newPost} setNewPost={setNewPost} addPost={addPost} />

      {/* 게시물 수정 대화상자 */}
      {selectedPost && (
        <EditPostDialog selectedPost={selectedPost} setSelectedPost={setSelectedPost} updatePost={updatePost} />
      )}

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog newComment={newComment} setNewComment={setNewComment} addComment={addComment} />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      {selectedPost && (
        <PostDetailDialog
          selectedPost={selectedPost}
          children={
            <PostComments
              postId={selectedPost.id}
              comments={comments}
              likeComment={likeComment}
              addPostComment={addPostComment}
              editPostComment={editPostComment}
              deletePostComment={deletePostComment}
            />
          }
        />
      )}

      {/* 사용자 모달 */}
      <UserDialog selectedUser={selectedUser} />
    </Card>
  )
}

export default PostsManager
