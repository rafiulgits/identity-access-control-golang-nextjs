package auth

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
)

func CheckIfJwtUserHasPermission(module, action string) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			authUser := GetUserClaims(ctx)
			userPolicyRepository := repositories.NewUserPolicyRepository()
			userPolicies, err := userPolicyRepository.Includes("Policy.Permissions").GetAllByFilter("user_id=?", authUser.UserID)
			if err != nil {
				errDto := dtos.NewDatabaseError(err)
				return ctx.JSON(errDto.ErrorCode, errDto)
			}
			hasAccess := false
			for _, up := range userPolicies {
				for _, perm := range up.Policy.Permissions {
					if strings.EqualFold(perm.Module, module) {
						for _, a := range perm.Access {
							if strings.EqualFold(a, action) {
								hasAccess = true
								break
							}
						}
					}
					if hasAccess {
						break
					}
				}
				if hasAccess {
					break
				}
			}

			if hasAccess {
				return next(ctx)
			}
			return echo.NewHTTPError(http.StatusForbidden, "access denied")
		}
	}
}
