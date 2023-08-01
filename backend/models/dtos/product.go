package dtos

import "github.com/rafiulgits/identity-access-control/models/validator"

type ProductUpsertDto struct {
	ID    int     `json:"id"`
	Name  string  `json:"name" validate:"required,max=80"`
	Code  string  `json:"code" validate:"required,max=10"`
	Price float64 `json:"price" validate:"gt=0"`
}

func (c *ProductUpsertDto) Validate() error {
	return validator.Validate.Struct(c)
}

type ProductDto struct {
	*ProductUpsertDto
	*BaseLogDto
}
