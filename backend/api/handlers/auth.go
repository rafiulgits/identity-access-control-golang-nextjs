package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rafiulgits/identity-access-control/api/auth"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/services"
	"github.com/rafiulgits/identity-access-control/util"
)

type AuthHandler struct {
	authService services.IAuthService
	userService services.IUserService
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		authService: services.NewAuthService(),
		userService: services.NewUserService(),
	}
}

func (h *AuthHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/auth")
	router.POST("/login/credential", h.credentialLogin)
	router.POST("/login/google", h.googleLogin)
	router.GET("/profile", h.getUserProfile, auth.JwtAuth)
	router.GET("/verify", h.verify, auth.JwtAuth, auth.CheckIfJwtUserHasPermission(util.CustomerModuleName, util.AccessRead))
}

func (h *AuthHandler) credentialLogin(ctx echo.Context) error {
	body := &dtos.CredentialLoginDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "credential login").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	token, err := h.authService.CredentialLogin(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, token)
}

func (h *AuthHandler) googleLogin(ctx echo.Context) error {
	body := &dtos.OAuthDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "google login").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	token, err := h.authService.GoogleLogin(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, token)
}

func (h *AuthHandler) getUserProfile(ctx echo.Context) error {
	authUser := auth.GetUserClaims(ctx)
	user, err := h.userService.GetUser(authUser.UserID)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, user)
}

func (h *AuthHandler) verify(ctx echo.Context) error {
	return ctx.JSON(200, map[string]string{"res": "ok"})
}
