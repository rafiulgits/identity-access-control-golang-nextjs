import { UserDto } from "@/models/user"
import { useSession } from "next-auth/react"

export const useUser = () => {
  const { data } = useSession()


  const hasPermission = (module: string, access: string) => {
    if (!data) {
      return false
    }
  }



  return {
    user: data ? data.user as UserDto : null,
    hasPermission,

  }

}