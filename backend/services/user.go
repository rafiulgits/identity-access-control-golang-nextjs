package services

import (
	"github.com/rafiulgits/go-automapper"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
	"github.com/rafiulgits/identity-access-control/util"
)

var _userPreloads = []string{"Accounts", "Policies.Policy.Permissions"}

type IUserService interface {
	CreateUser(data *dtos.UserCreateDto) (*dtos.UserDto, *dtos.ErrorDto)
	GetAllUsers() ([]*dtos.UserDto, *dtos.ErrorDto)
	DeleteUser(id int) *dtos.ErrorDto
}

type UserService struct {
	userRepository repositories.IUserRepository
}

func NewUserService() *UserService {
	return &UserService{
		userRepository: repositories.NewUserRepository(),
	}
}

func (s *UserService) CreateUser(data *dtos.UserCreateDto) (*dtos.UserDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	policies := make([]domains.UserPolicy, 0)
	for _, p := range data.PolicyIDs {
		policies = append(policies, domains.UserPolicy{PolicyID: p})
	}
	user := &domains.User{}
	automapper.Map(data, user)
	user.ID = 0
	user.Policies = policies
	createdUser, err := s.userRepository.Create(user)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating user")
		return nil, dtos.NewDatabaseError(err)
	}
	userDto := &dtos.UserDto{}
	automapper.Map(createdUser, userDto)
	return userDto, nil
}

func (s *UserService) GetAllUsers() ([]*dtos.UserDto, *dtos.ErrorDto) {
	users, err := s.userRepository.Includes(_userPreloads...).GetAll()
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "all users").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching all users")
		return nil, dtos.NewDatabaseError(err)
	}
	userDtos := make([]*dtos.UserDto, 0)
	automapper.Map(users, &userDtos)
	return userDtos, nil
}

func (s *UserService) DeleteUser(id int) *dtos.ErrorDto {
	if err := s.userRepository.Any("id=?", id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while checking user existance by id")
		return dtos.NewDatabaseError(err)
	}
	if err := s.userRepository.Delete(id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while deleting user")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
