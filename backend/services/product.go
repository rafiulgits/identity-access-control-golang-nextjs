package services

import (
	"time"

	"github.com/rafiulgits/go-automapper"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
	"github.com/rafiulgits/identity-access-control/util"
)

type IProductService interface {
	CreateProduct(data *dtos.ProductUpsertDto) (*dtos.ProductDto, *dtos.ErrorDto)
	UpdateProduct(data *dtos.ProductUpsertDto) (*dtos.ProductDto, *dtos.ErrorDto)
	GetAllProducts() ([]*dtos.ProductDto, *dtos.ErrorDto)
	DeleteProduct(id int) *dtos.ErrorDto
}

type ProductService struct {
	productRepository repositories.IProductRepository
}

func NewProductService() *ProductService {
	return &ProductService{
		productRepository: repositories.NewProductRepository(),
	}
}

func (s *ProductService) CreateProduct(data *dtos.ProductUpsertDto) (*dtos.ProductDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	product := &domains.Product{}
	automapper.Map(data, product)
	product.ID = 0
	createdProduct, err := s.productRepository.Create(product)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating product")
		return nil, dtos.NewDatabaseError(err)
	}
	productDto := &dtos.ProductDto{}
	automapper.Map(createdProduct, productDto)
	return productDto, nil
}

func (s *ProductService) UpdateProduct(data *dtos.ProductUpsertDto) (*dtos.ProductDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	product, err := s.productRepository.Get(data.ID)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("datebase error while fetching product by id")
		return nil, dtos.NewDatabaseError(err)
	}
	automapper.Map(data, product)
	product.LastUpdatedTime = time.Now().UnixMilli()
	updatedProduct, err := s.productRepository.Update(product)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while updating product")
		return nil, dtos.NewDatabaseError(err)
	}
	productDto := &dtos.ProductDto{}
	automapper.Map(updatedProduct, productDto)
	return productDto, nil
}

func (s *ProductService) GetAllProducts() ([]*dtos.ProductDto, *dtos.ErrorDto) {
	products, err := s.productRepository.GetAll()
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "all products").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching all products")
		return nil, dtos.NewDatabaseError(err)
	}
	productDtos := make([]*dtos.ProductDto, 0)
	automapper.Map(products, &productDtos)
	return productDtos, nil
}

func (s *ProductService) DeleteProduct(id int) *dtos.ErrorDto {
	if err := s.productRepository.Any("id=?", id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while checking product existance by id")
		return dtos.NewDatabaseError(err)
	}
	if err := s.productRepository.Delete(id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "product delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while deleting product")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
