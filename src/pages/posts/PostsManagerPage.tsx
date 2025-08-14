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
import { Post, PostsTags } from "../../entities/posts"
import { Comments } from "../../entities/comments/api/types"
import { usePagination, useSearchFilter, useLoading, usePostDialogs } from "../../shared/store"
import { AddCommentForm, NewComment, useAddComment } from "../../features/comments/add-comment"
import { AddPostForm, NewPost, useAddPost } from "../../features/posts/add-post"
import { PostDetailDialog, usePostDetail } from "../../features/posts/post-detail"
import { Pagination } from "../../widgets"
import { PostList, usePostList, PostsWithUsers } from "../../features/posts/post-list"
import { EditCommentForm, useEditComment } from "../../features/comments/edit-comment"
import { EditPostForm, useEditPost } from "../../features/posts/edit-post"
import { UserInfoDialog, useUserInfo } from "../../features/user/user-info"
import { CommentList, CommentsObj } from "../../features/comments/comment-list/ui/CommentList"
import { useCommentList } from "../../features/comments/comment-list"

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
  const { loading } = useLoading()
  const { setShowAddDialog } = usePostDialogs()

  // 로컬 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Array<PostsTags>>([])
  const [comments, setComments] = useState<CommentsObj>({})
  const [selectedComment, setSelectedComment] = useState<Comments | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })

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

  const { deletePostComment, likeComment, fetchComments } = useCommentList()
  const { addComment, addPostComment } = useAddComment()
  const { updateComment, editPostComment } = useEditComment()
  const { addPost } = useAddPost()
  const { updatePost, deletePost, openEditDialog } = useEditPost()
  const { openPostDetail } = usePostDetail()
  const { loadData, searchPosts, fetchPostsByTag, fetchTags, filteredPostTag } = usePostList()
  const { openUserModal } = useUserInfo()

  useEffect(() => {
    fetchTags(setTags)
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag, limit, skip, setPosts, setTotal, () => loadData(limit, skip, setPosts, setTotal))
    } else {
      loadData(limit, skip, setPosts, setTotal)
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
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    searchPosts(searchQuery, setPosts, setTotal, () => loadData(limit, skip, setPosts, setTotal))
                  }
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value, limit, skip, setPosts, setTotal, () => loadData(limit, skip, setPosts, setTotal))
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
            <PostList
              posts={posts}
              selectedTag={selectedTag}
              openUserModal={(userId: number) => openUserModal(userId)}
              openPostDetail={(post: PostsWithUsers) =>
                openPostDetail(post, setSelectedPost, fetchComments, comments, setComments)
              }
              deletePost={(postId: number) => deletePost(postId, posts, setPosts)}
              filteredPostTag={(tagName: string) => filteredPostTag(tagName, setSelectedTag, updateURL)}
              openEditDialog={(selectedPost: PostsWithUsers) => openEditDialog(selectedPost, setSelectedPost)}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostForm
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={(newPost: NewPost) => addPost(newPost, posts, setPosts, setNewPost)}
      />

      {/* 게시물 수정 대화상자 */}
      {selectedPost && (
        <EditPostForm
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          updatePost={(selectedPost: Post) => updatePost(selectedPost, posts, setPosts)}
        />
      )}

      {/* 댓글 추가 대화상자 */}
      <AddCommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={(newComment: NewComment) => addComment(newComment, setComments, setNewComment)}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentForm
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        updateComment={(selectedComment: Comments | null) => updateComment(selectedComment, setComments)}
      />

      {/* 게시물 상세 보기 대화상자 */}
      {selectedPost && (
        <PostDetailDialog
          selectedPost={selectedPost}
          children={
            <CommentList
              postId={selectedPost.id}
              comments={comments}
              likeComment={(commentId: number, postId: number) => likeComment(commentId, postId, comments, setComments)}
              addPostComment={(postId: number) => addPostComment(postId, setNewComment)}
              editPostComment={(comment: Comments) => editPostComment(comment, setSelectedComment)}
              deletePostComment={(commentId: number, postId: number) =>
                deletePostComment(commentId, postId, setComments)
              }
            />
          }
        />
      )}

      {/* 사용자 모달 */}
      <UserInfoDialog />
    </Card>
  )
}

export default PostsManager
