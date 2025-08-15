import { useEffect } from "react"
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
import { usePagination, useSearchFilter, usePostDialogs } from "../../shared/store"
import { useTagsQuery } from "../../features/posts/model/queries"
import { AddCommentForm } from "../../features/comments/add-comment"
import { AddPostForm } from "../../features/posts/add-post"
import { PostDetailDialog } from "../../features/posts/post-detail"
import { Pagination } from "../../widgets"
import { PostList } from "../../features/posts/post-list"
import { EditCommentForm } from "../../features/comments/edit-comment"
import { EditPostForm } from "../../features/posts/edit-post"
import { UserInfoDialog } from "../../features/user/user-info"
import { CommentList } from "../../features/comments/comment-list/ui/CommentList"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 전역 상태 훅 사용
  const { skip, setSkip, limit, setLimit } = usePagination()
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag, sortBy, setSortBy, sortOrder, setSortOrder } =
    useSearchFilter()
  const { setShowAddDialog } = usePostDialogs()
  const { data: tags = [] } = useTagsQuery()

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

  // URL 동기화를 위한 useEffect
  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // URL 파라미터 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("q") || "")
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateURL()
                    }
                  }}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
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
          <PostList updateURL={updateURL} />

          {/* 페이지네이션 */}
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostForm />

      {/* 게시물 수정 대화상자 */}
      <EditPostForm />

      {/* 댓글 추가 대화상자 */}
      <AddCommentForm />

      {/* 댓글 수정 대화상자 */}
      <EditCommentForm />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog children={<CommentList />} />

      {/* 사용자 모달 */}
      <UserInfoDialog />
    </Card>
  )
}

export default PostsManager
