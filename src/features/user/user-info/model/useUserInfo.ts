import { getUserInfo } from "../../../../entities/users"
import { useUserDialog } from "../../../../shared/store"
import { useSelectedUser } from "../../model"

export const useUserInfo = () => {
  const { setSelectedUser } = useSelectedUser()
  const { setShowUserDialog } = useUserDialog()

  const openUserModal = async (userId: number) => {
    try {
      const response = await getUserInfo(userId)
      const userData = response.data
      console.log(userData)
      setSelectedUser(userData)
      setShowUserDialog(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return { openUserModal }
}
