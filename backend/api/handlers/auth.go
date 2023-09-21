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
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		authService: services.NewAuthService(),
	}
}

func (h *AuthHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/auth")
	router.POST("/login/credential", h.credentialLogin)
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

func (h *AuthHandler) verify(ctx echo.Context) error {
	return ctx.JSON(200, map[string]string{"res": "ok"})
}
