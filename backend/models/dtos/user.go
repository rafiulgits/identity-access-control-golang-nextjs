package dtos

import (
	"errors"

	"github.com/rafiulgits/identity-access-control/models/validator"
)

type UserCreateAccountDto struct {
	AuthProvider string `json:"authProvider" validate:"oneof='google' 'credential' 'microsoft'"`
	Name         string `json:"name" validate:"max=150"`
	Secret       string `json:"secret" validate:"max=150"`
}

func (a *UserCreateAccountDto) Validate() error {
	if err := validator.Validate.Struct(a); err != nil {
		return err
	}
	if a.AuthProvider == "credential" {
		if a.Name == "" || a.Secret == "" {
			return errors.New("provide your credential")
		}
	}
	return nil
}

type UserCreateDto struct {
	Name      string                  `json:"name" validate:"required,max=80"`
	Accounts  []*UserCreateAccountDto `json:"accounts" validate:"gt=0"`
	PolicyIDs []int                   `json:"policyIds"`
}

func (u *UserCreateDto) Validate() error {
	if err := validator.Validate.Struct(u); err != nil {
		return err
	}
	for _, a := range u.Accounts {
		if err := a.Validate(); err != nil {
			return err
		}
	}
	return nil
}

type UserPolicyDto struct {
	PolicyID int            `json:"policyId"`
	Policy   *PolicyBaseDto `json:"policy"`
}

type AccountDto struct {
	ID           int    `json:"id"`
	AuthProvider string `json:"authProvider"`
	Name         string `json:"name"`
	UserID       int    `json:"userId"`
}

type UserDto struct {
	ID       int              `json:"id"`
	Name     string           `json:"name"`
	Policies []*UserPolicyDto `json:"policies"`
	Accounts []*AccountDto    `json:"accounts"`
}

type UserUpdateDto struct {
	ID        int    `json:"id" validate:"gt=0"`
	Name      string `json:"name" validate:"required,max=80"`
	PolicyIDs []int  `json:"policyIds"`
}

func (u *UserUpdateDto) Validate() error {
	return validator.Validate.Struct(u)
}

type AccountUpsertDto struct {
	ID     int `json:"id"`
	UserID int `json:"userId" validate:"gt=0"`
	*UserCreateAccountDto
}

func (a *AccountUpsertDto) Validate() error {
	return validator.Validate.Struct(a)
}
