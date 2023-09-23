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

type CustomerHandler struct {
	customerService services.ICustomerService
}

func NewCustomerHandler() *CustomerHandler {
	return &CustomerHandler{
		customerService: services.NewCustomerService(),
	}
}

func (h *CustomerHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/customers", auth.JwtAuth)

	router.POST("", h.createCustomer, auth.CheckIfJwtUserHasPermission(util.CustomerModuleName, util.AccessCreate))
	router.GET("", h.getAllCustomers, auth.CheckIfJwtUserHasPermission(util.CustomerModuleName, util.AccessRead))
	router.PUT("/:customerId", h.updateCustomer, auth.CheckIfJwtUserHasPermission(util.CustomerModuleName, util.AccessUpdate))
	router.DELETE("/:customerId", h.deleteCustomer, auth.CheckIfJwtUserHasPermission(util.CustomerModuleName, util.AccessDelete))
}

func (h *CustomerHandler) getAllCustomers(ctx echo.Context) error {
	customers, err := h.customerService.GetAllCustomers()
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, customers)
}

func (h *CustomerHandler) createCustomer(ctx echo.Context) error {
	body := &dtos.CustomerUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "customer create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	customer, err := h.customerService.CreateCustomer(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, customer)
}

func (h *CustomerHandler) updateCustomer(ctx echo.Context) error {
	body := &dtos.CustomerUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "customer update").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.ID != parser.Int(ctx.Param("customerId")) {
		return echo.NewHTTPError(http.StatusBadRequest, "customer id mismatched")
	}
	customer, err := h.customerService.UpdateCustomer(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, customer)
}

func (h *CustomerHandler) deleteCustomer(ctx echo.Context) error {
	id := parser.Int(ctx.Param("customerId"))
	err := h.customerService.DeleteCustomer(id)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}
