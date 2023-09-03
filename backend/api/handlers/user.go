package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
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
	router := e.Group("/users")

	router.GET("", h.getAllUsers)
	router.POST("", h.createUser)

	router.DELETE("/:userId", h.deleteUser)
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
