package services

import (
	"github.com/rafiulgits/go-automapper"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
	"github.com/rafiulgits/identity-access-control/models/dtos"
	"github.com/rafiulgits/identity-access-control/repositories"
	"github.com/rafiulgits/identity-access-control/util"
	"github.com/samber/lo"
	"gorm.io/gorm"
)

var _userPreloads = []string{"Accounts", "Policies.Policy"}

type IUserService interface {
	CreateUser(data *dtos.UserCreateDto) (*dtos.UserDto, *dtos.ErrorDto)
	GetAllUsers() ([]*dtos.UserDto, *dtos.ErrorDto)
	GetUser(id int) (*dtos.UserDto, *dtos.ErrorDto)
	UpdateUser(data *dtos.UserUpdateDto) (*dtos.UserDto, *dtos.ErrorDto)
	DeleteUser(id int) *dtos.ErrorDto
	CreateUserAccount(data *dtos.AccountUpsertDto) (*dtos.AccountDto, *dtos.ErrorDto)
	UpdateUserAccount(data *dtos.AccountUpsertDto) (*dtos.AccountDto, *dtos.ErrorDto)
	DeleteUserAccount(userId, accountId int) *dtos.ErrorDto
}

type UserService struct {
	userRepository       repositories.IUserRepository
	accountRepository    repositories.IAccountRepository
	userPolicyRepository repositories.IUserPolicyRepository
}

func NewUserService() *UserService {
	return &UserService{
		userRepository:       repositories.NewUserRepository(),
		accountRepository:    repositories.NewAccountRepository(),
		userPolicyRepository: repositories.NewUserPolicyRepository(),
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
	for _, a := range user.Accounts {
		if a.AuthProvider == util.AuthProviderCredential {
			a.SetPassword(a.Secret)
		}
	}
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

func (s *UserService) UpdateUser(data *dtos.UserUpdateDto) (*dtos.UserDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		//TODO: log
		return nil, dtos.NewValidationError(err)
	}
	user, err := s.userRepository.Includes("Policies").Get(data.ID)
	if err != nil {
		//TODO: log
		return nil, dtos.NewDatabaseError(err)
	}
	user.Name = data.Name

	userPolicyIds := make([]int, 0)
	for _, up := range user.Policies {
		userPolicyIds = append(userPolicyIds, up.PolicyID)
	}
	policyIdsToDelete, policyIdsToCreate := lo.Difference(userPolicyIds, data.PolicyIDs)
	policyToCreate := make([]*domains.UserPolicy, 0)
	for _, i := range policyIdsToCreate {
		policyToCreate = append(policyToCreate, &domains.UserPolicy{UserID: data.ID, PolicyID: i})
	}

	txnErr := infra.GetInfra().GetDatabase().Transaction(func(tx *gorm.DB) error {
		if err := tx.
			Where("user_id=? AND policy_id IN (?)", data.ID, policyIdsToDelete).
			Delete(&domains.UserPolicy{}).
			Error; err != nil {
			return err
		}
		if err := tx.CreateInBatches(policyToCreate, len(policyToCreate)).Error; err != nil {
			return err
		}
		if err := tx.Save(user).Error; err != nil {
			return err
		}
		return nil
	})

	if txnErr != nil {
		return nil, dtos.NewDatabaseError(txnErr)
	}
	return s.GetUser(user.ID)
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

func (s *UserService) GetUser(id int) (*dtos.UserDto, *dtos.ErrorDto) {
	user, err := s.userRepository.Includes(_userPreloads...).Get(id)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "get user").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching user by id")
		return nil, dtos.NewDatabaseError(err)
	}
	userDto := &dtos.UserDto{}
	automapper.Map(user, userDto)
	return userDto, nil
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

func (s *UserService) CreateUserAccount(data *dtos.AccountUpsertDto) (*dtos.AccountDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	account := &domains.Account{}
	automapper.Map(data, account)
	account.ID = 0
	if account.AuthProvider == util.AuthProviderCredential {
		account.SetPassword(account.Secret)
	}
	createdAccount, err := s.accountRepository.Create(account)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating user account")
		return nil, dtos.NewDatabaseError(err)
	}
	accountDto := &dtos.AccountDto{}
	automapper.Map(createdAccount, accountDto)
	return accountDto, nil

}

func (s *UserService) UpdateUserAccount(data *dtos.AccountUpsertDto) (*dtos.AccountDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	account, err := s.accountRepository.GetByFilter("id=? AND user_id=?", data.ID, data.UserID)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account update").
			Str("loc", util.GetExecLocation()).Any("payload", data.ID).Err(err).Msg("database error while fetching user account")
		return nil, dtos.NewDatabaseError(err)
	}

	if data.AuthProvider == util.AuthProviderCredential && account.AuthProvider != data.AuthProvider {
		account.SetPassword(data.Secret)
		data.Secret = account.Secret
	}

	automapper.Map(data, account)
	updatedAccount, err := s.accountRepository.Update(account)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account update").
			Str("loc", util.GetExecLocation()).Int("payload", data.ID).Err(err).Msg("database error while updating user account")
		return nil, dtos.NewDatabaseError(err)
	}
	accountDto := &dtos.AccountDto{}
	automapper.Map(updatedAccount, accountDto)
	return accountDto, nil
}

func (s *UserService) DeleteUserAccount(userId, accountId int) *dtos.ErrorDto {
	if err := s.accountRepository.Any("id=? AND user_id=?", accountId, userId); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account delete").Str("loc", util.GetExecLocation()).
			Ints("payload", []int{userId, accountId}).Err(err).Msg("datebase error while checking user account existance")
		return dtos.NewDatabaseError(err)
	}
	if err := s.accountRepository.Delete(accountId); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "user account delete").Str("loc", util.GetExecLocation()).
			Ints("payload", []int{userId, accountId}).Err(err).Msg("datebase error while deleting user account")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
