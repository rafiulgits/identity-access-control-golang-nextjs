package dtos

import "github.com/rafiulgits/identity-access-control/models/validator"

type VendorUpsertDto struct {
	ID      int    `json:"id"`
	Name    string `json:"name" validate:"required,max=80"`
	Code    string `json:"code" validate:"required,max=10"`
	Phone   string `json:"phone" validate:"max=20"`
	Address string `json:"address" validate:"max=100"`
}

func (c *VendorUpsertDto) Validate() error {
	return validator.Validate.Struct(c)
}

type VendorDto struct {
	*VendorUpsertDto
	*BaseLogDto
}
