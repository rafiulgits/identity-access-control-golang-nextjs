package services

import (
	"github.com/rafiulgits/identity-access-control/api/auth"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
	"github.com/rafiulgits/identity-access-control/util"
)

type IAuthService interface {
	CredentialLogin(data *dtos.CredentialLoginDto) (*dtos.TokenDto, *dtos.ErrorDto)
}

type AuthService struct {
	accountRepository repositories.IAccountRepository
}

func NewAuthService() *AuthService {
	return &AuthService{
		accountRepository: repositories.NewAccountRepository(),
	}
}

func (s *AuthService) CredentialLogin(data *dtos.CredentialLoginDto) (*dtos.TokenDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "credential login").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	account, err := s.accountRepository.GetByFilter("auth_provider=? AND name=?", "credential", data.Name)
	if err != nil {
		//TODO: log
		return nil, dtos.NewDatabaseError(err)
	}

	//TODO: hashing the secret and compare the secret by hash value
	if account.Secret != data.Secret {
		return nil, dtos.NewDefaultErrorDto("incorrect password or secret")
	}
	accessToken, err := auth.GenerateToken(account.UserID)
	if err != nil {
		//TODO: log
		return nil, dtos.NewDefaultErrorDto(err.Error())
	}
	return &dtos.TokenDto{Bearer: accessToken}, nil
}
