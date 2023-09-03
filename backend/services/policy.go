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

type IPolicyService interface {
	CreatePolicy(data *dtos.PolicyUpsertDto) (*dtos.PolicyDto, *dtos.ErrorDto)
	UpdatePolicy(data *dtos.PolicyUpsertDto) (*dtos.PolicyDto, *dtos.ErrorDto)
	GetAllPolicies() ([]*dtos.PolicyDto, *dtos.ErrorDto)
	GetPolicyByID(id int) (*dtos.PolicyDto, *dtos.ErrorDto)
	DeletePolicy(id int) *dtos.ErrorDto
}

type PolicyService struct {
	policyRepository repositories.IPolicyRepository
}

func NewPolicyService() *PolicyService {
	return &PolicyService{
		policyRepository: repositories.NewPolicyRepository(),
	}
}

func (s *PolicyService) CreatePolicy(data *dtos.PolicyUpsertDto) (*dtos.PolicyDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	policy := &domains.Policy{}
	automapper.Map(data, policy)
	policy.ID = 0
	createdPolicy, err := s.policyRepository.Create(policy)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating policy")
		return nil, dtos.NewDatabaseError(err)
	}
	policyDto := &dtos.PolicyDto{}
	automapper.Map(createdPolicy, policyDto)
	return policyDto, nil
}

func (s *PolicyService) UpdatePolicy(data *dtos.PolicyUpsertDto) (*dtos.PolicyDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	policy, err := s.policyRepository.Get(data.ID)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("datebase error while fetching policy by id")
		return nil, dtos.NewDatabaseError(err)
	}
	automapper.Map(data, policy)
	policy.LastUpdatedTime = time.Now().UnixMilli()
	updatedPolicy, err := s.policyRepository.Update(policy)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while updating policy")
		return nil, dtos.NewDatabaseError(err)
	}
	policyDto := &dtos.PolicyDto{}
	automapper.Map(updatedPolicy, policyDto)
	return policyDto, nil
}

func (s *PolicyService) GetAllPolicies() ([]*dtos.PolicyDto, *dtos.ErrorDto) {
	policys, err := s.policyRepository.Includes("Permissions").GetAll()
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "all policys").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching all policys")
		return nil, dtos.NewDatabaseError(err)
	}
	policyDtos := make([]*dtos.PolicyDto, 0)
	automapper.Map(policys, &policyDtos)
	return policyDtos, nil
}

func (s *PolicyService) GetPolicyByID(id int) (*dtos.PolicyDto, *dtos.ErrorDto) {
	panic("not imp")
}

func (s *PolicyService) DeletePolicy(id int) *dtos.ErrorDto {
	if err := s.policyRepository.Any("id=?", id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while checking policy existance by id")
		return dtos.NewDatabaseError(err)
	}
	if err := s.policyRepository.Delete(id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "policy delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while deleting policy")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
