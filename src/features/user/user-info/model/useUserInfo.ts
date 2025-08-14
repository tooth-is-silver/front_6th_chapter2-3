import { useState } from "react"
import { getUserInfo } from "../../../../entities/users"
import { useUserDialog } from "../../../../shared/store"
import type { UserInfo } from "../../../../entities/users"

export const useUserInfo = () => {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const { setShowUserDialog } = useUserDialog()

  const openUserModal = async (userId: number) => {
    try {
      const response = await getUserInfo(userId)
      const userData = response.data
      setSelectedUser(userData)
      setShowUserDialog(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return { openUserModal, selectedUser }
}
