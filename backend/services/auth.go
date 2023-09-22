package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rafiulgits/identity-access-control/api/auth"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
	"github.com/rafiulgits/identity-access-control/util"
)

type IAuthService interface {
	CredentialLogin(data *dtos.CredentialLoginDto) (*dtos.TokenDto, *dtos.ErrorDto)
	GoogleLogin(data *dtos.OAuthDto) (*dtos.TokenDto, *dtos.ErrorDto)
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
	account, err := s.accountRepository.GetByFilter("auth_provider=? AND name=?", util.AuthProviderCredential, data.Name)
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

func (s *AuthService) GoogleLogin(data *dtos.OAuthDto) (*dtos.TokenDto, *dtos.ErrorDto) {
	if data.Provider != util.AuthProviderGoogle {
		return nil, &dtos.ErrorDto{Message: "invalid auth provider"}
	}
	googleProfile, err := s.getGoogleProfile(data.AccessToken)
	if err != nil {
		return nil, &dtos.ErrorDto{Message: err.Error()}
	}

	account, err := s.accountRepository.GetByFilter("auth_provider=? AND name=?", util.AuthProviderGoogle, googleProfile["email"])

	if err != nil {
		//TODO: log
		return nil, dtos.NewDatabaseError(err)
	}
	accessToken, err := auth.GenerateToken(account.UserID)
	if err != nil {
		//TODO: log
		return nil, dtos.NewDefaultErrorDto(err.Error())
	}
	return &dtos.TokenDto{Bearer: accessToken}, nil
}

func (s *AuthService) getGoogleProfile(token string) (map[string]interface{}, error) {
	url := fmt.Sprintf("https://www.googleapis.com/oauth2/v3/userinfo?access_token=%s", token)
	httpReq, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	httpClient := &http.Client{}
	httpRes, err := httpClient.Do(httpReq)

	if err != nil {
		return nil, err
	}

	data := make(map[string]interface{})

	err = json.NewDecoder(httpRes.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}
