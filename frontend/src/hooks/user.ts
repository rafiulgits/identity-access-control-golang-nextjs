import { UserDto } from "@/models/user"
import { useSession } from "next-auth/react"

export const useUser = () => {
  const { data } = useSession()


  const hasPermission = () => {

  }



  return {
    user: data ? data.user as UserDto : null,
    hasPermission,

  }

}