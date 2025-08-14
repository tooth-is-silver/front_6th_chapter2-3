import { getUserInfo } from "../../../../entities/users"
import { useUserDialog } from "../../../../shared/store"
import type { UserInfo } from "../../../../entities/users"
import { SetStateAction } from "react"

export const useUserInfo = () => {
  const { setShowUserDialog } = useUserDialog()

  const openUserModal = async (userId: number, setSelectedUser: (value: SetStateAction<UserInfo | null>) => void) => {
    try {
      const response = await getUserInfo(userId)
      const userData = response.data
      setSelectedUser(userData)
      setShowUserDialog(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return { openUserModal }
}
