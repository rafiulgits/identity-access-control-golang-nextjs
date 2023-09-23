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

type ProductHandler struct {
	productService services.IProductService
}

func NewProductHandler() *ProductHandler {
	return &ProductHandler{
		productService: services.NewProductService(),
	}
}

func (h *ProductHandler) RegisterEcho(e *echo.Echo) {
	router := e.Group("/products", auth.JwtAuth)

	router.POST("", h.createProduct, auth.CheckIfJwtUserHasPermission(util.ProductModuleName, util.AccessCreate))
	router.GET("", h.getAllProducts, auth.CheckIfJwtUserHasPermission(util.ProductModuleName, util.AccessRead))
	router.PUT("/:productId", h.updateProduct, auth.CheckIfJwtUserHasPermission(util.ProductModuleName, util.AccessUpdate))
	router.DELETE("/:productId", h.deleteProduct, auth.CheckIfJwtUserHasPermission(util.ProductModuleName, util.AccessDelete))
}

func (h *ProductHandler) getAllProducts(ctx echo.Context) error {
	products, err := h.productService.GetAllProducts()
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, products)
}

func (h *ProductHandler) createProduct(ctx echo.Context) error {
	body := &dtos.ProductUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "product create").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	product, err := h.productService.CreateProduct(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusCreated, product)
}

func (h *ProductHandler) updateProduct(ctx echo.Context) error {
	body := &dtos.ProductUpsertDto{}
	if err := ctx.Bind(body); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "handler").Str("topic", "product update").
			Str("loc", util.GetExecLocation()).Err(err).Msg("failed to parse request body")
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if body.ID != parser.Int(ctx.Param("productId")) {
		return echo.NewHTTPError(http.StatusBadRequest, "product id mismatched")
	}
	product, err := h.productService.UpdateProduct(body)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.JSON(http.StatusOK, product)
}

func (h *ProductHandler) deleteProduct(ctx echo.Context) error {
	id := parser.Int(ctx.Param("productId"))
	err := h.productService.DeleteProduct(id)
	if err != nil {
		return ctx.JSON(err.ErrorCode, err)
	}
	return ctx.NoContent(http.StatusNoContent)
}
