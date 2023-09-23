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

type VendorHandler struct {
	vendorService services.IVendorService
}

func NewVendorHandler() *VendorHandler {
	return &VendorHandler{
		vendorService: services.NewVendorService(),
	}
}

func (h *VendorHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/vendors", auth.JwtAuth)

	router.POST("", h.createVendor, auth.CheckIfJwtUserHasPermission(util.VendorModuleName, util.AccessCreate))
	router.GET("", h.getAllVendors, auth.CheckIfJwtUserHasPermission(util.VendorModuleName, util.AccessRead))
	router.PUT("/:vendorId", h.updateVendor, auth.CheckIfJwtUserHasPermission(util.VendorModuleName, util.AccessUpdate))
	router.DELETE("/:vendorId", h.deleteVendor, auth.CheckIfJwtUserHasPermission(util.VendorModuleName, util.AccessDelete))
}

func (h *VendorHandler) getAllVendors(ctx echo.Context) error {
	vendors, err := h.vendorService.GetAllVendors()
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, vendors)
}

func (h *VendorHandler) createVendor(ctx echo.Context) error {
	body := &dtos.VendorUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "vendor create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	vendor, err := h.vendorService.CreateVendor(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, vendor)
}

func (h *VendorHandler) updateVendor(ctx echo.Context) error {
	body := &dtos.VendorUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "vendor update").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.ID != parser.Int(ctx.Param("vendorId")) {
		return echo.NewHTTPError(http.StatusBadRequest, "vendor id mismatched")
	}
	vendor, err := h.vendorService.UpdateVendor(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, vendor)
}

func (h *VendorHandler) deleteVendor(ctx echo.Context) error {
	id := parser.Int(ctx.Param("vendorId"))
	err := h.vendorService.DeleteVendor(id)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}
