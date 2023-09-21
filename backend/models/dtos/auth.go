package dtos

import "github.com/rafiulgits/identity-access-control/models/validator"

type CredentialLoginDto struct {
	Name   string `json:"name" validate:"required,max=150"`
	Secret string `json:"secret" validate:"required,max=150"`
}

func (c *CredentialLoginDto) Validate() error {
	return validator.Validate.Struct(c)
}

type TokenDto struct {
	Bearer string `json:"bearer"`
}
