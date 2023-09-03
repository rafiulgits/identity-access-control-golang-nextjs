package dtos

import "github.com/rafiulgits/identity-access-control/models/validator"

type PermissionDto struct {
	ID       int    `json:"id"`
	PolicyID int    `json:"policyId"`
	Access   int    `json:"access"`
	Module   string `json:"module"`
	*BaseLogDto
}

type PolicyDto struct {
	ID          int              `json:"id"`
	Name        string           `json:"name"`
	Permissions []*PermissionDto `json:"permissions"`
	*BaseLogDto
}

type PolicyUpsertDto struct {
	ID          int                          `json:"id"`
	Name        string                       `json:"name" validate:"required,max=80"`
	Permissions []*PolicyUpsertPermissionDto `json:"permissions" validate:"gt=0,dive"`
}

func (p *PolicyUpsertDto) Validate() error {
	return validator.Validate.Struct(p)
}

type PolicyUpsertPermissionDto struct {
	Access int    `json:"access" validate:"gt=0"`
	Module string `json:"module" validate:"required,max=30"`
}
