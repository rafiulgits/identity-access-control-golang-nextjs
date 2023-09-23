package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rafiulgits/identity-access-control/api/auth"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/parser"
	"github.com/rafiulgits/identity-access-control/services"
	"github.com/rafiulgits/identity-access-control/util"
)

type UserHandler struct {
	userService services.IUserService
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: services.NewUserService(),
	}
}

func (h *UserHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/users", auth.JwtAuth)

	router.POST("", h.createUser, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessCreate))
	router.GET("", h.getAllUsers, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessRead))
	router.PUT("/:userId", h.updateUser, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessUpdate))
	router.DELETE("/:userId", h.deleteUser, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessDelete))

	accountRouter := router.Group("/:userId/accounts")
	accountRouter.POST("", h.createUserAccount, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessCreate))
	accountRouter.PUT("/:accountId", h.updateUserAccount, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessUpdate))
	accountRouter.DELETE("/:accountId", h.deleteUserAccount, auth.CheckIfJwtUserHasPermission(util.UserModuleName, util.AccessDelete))
}

func (h *UserHandler) getAllUsers(ctx echo.Context) error {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, users)
}

func (h *UserHandler) createUser(ctx echo.Context) error {
	body := &dtos.UserCreateDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "user create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	user, err := h.userService.CreateUser(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, user)
}

func (h *UserHandler) deleteUser(ctx echo.Context) error {
	id := parser.Int(ctx.Param("userId"))
	err := h.userService.DeleteUser(id)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}

func (h *UserHandler) updateUser(ctx echo.Context) error {
	body := &dtos.UserUpdateDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "user create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	user, err := h.userService.UpdateUser(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, user)
}

func (h *UserHandler) createUserAccount(ctx echo.Context) error {
	body := &dtos.AccountUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "user account create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	account, err := h.userService.CreateUserAccount(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, account)
}

func (h *UserHandler) updateUserAccount(ctx echo.Context) error {
	body := &dtos.AccountUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "user account update").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.ID != parser.Int(ctx.Param("accountId")) {
		return echo.NewHTTPError(http.StatusBadRequest, "account id mismatched")
	}
	account, err := h.userService.UpdateUserAccount(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, account)
}

func (h *UserHandler) deleteUserAccount(ctx echo.Context) error {
	userId := parser.Int(ctx.Param("userId"))
	accountId := parser.Int(ctx.Param("accountId"))
	err := h.userService.DeleteUserAccount(userId, accountId)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}
