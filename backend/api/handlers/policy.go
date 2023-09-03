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

type PolicyHandler struct {
	policyService services.IPolicyService
}

func NewPolicyHandler() *PolicyHandler {
	return &PolicyHandler{
		policyService: services.NewPolicyService(),
	}
}

func (h *PolicyHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/policies")

	router.GET("", h.getAllPolicys)
	router.POST("", h.createPolicy)

	router.PUT("/:policyId", h.updatePolicy)
	router.DELETE("/:policyId", h.deletePolicy)
}

func (h *PolicyHandler) getAllPolicys(ctx echo.Context) error {
	policys, err := h.policyService.GetAllPolicies()
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, policys)
}

func (h *PolicyHandler) createPolicy(ctx echo.Context) error {
	body := &dtos.PolicyUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "policy create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	policy, err := h.policyService.CreatePolicy(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, policy)
}

func (h *PolicyHandler) updatePolicy(ctx echo.Context) error {
	body := &dtos.PolicyUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "policy update").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.ID != parser.Int(ctx.Param("policyId")) {
		return echo.NewHTTPError(http.StatusBadRequest, "policy id mismatched")
	}
	policy, err := h.policyService.UpdatePolicy(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, policy)
}

func (h *PolicyHandler) deletePolicy(ctx echo.Context) error {
	id := parser.Int(ctx.Param("policyId"))
	err := h.policyService.DeletePolicy(id)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}
