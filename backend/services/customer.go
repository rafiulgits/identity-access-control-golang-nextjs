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

type ICustomerService interface {
	CreateCustomer(data *dtos.CustomerUpsertDto) (*dtos.CustomerDto, *dtos.ErrorDto)
	UpdateCustomer(data *dtos.CustomerUpsertDto) (*dtos.CustomerDto, *dtos.ErrorDto)
	GetAllCustomers() ([]*dtos.CustomerDto, *dtos.ErrorDto)
	DeleteCustomer(id int) *dtos.ErrorDto
}

type CustomerService struct {
	customerRepository repositories.ICustomerRepository
}

func NewCustomerService() *CustomerService {
	return &CustomerService{
		customerRepository: repositories.NewCustomerRepository(),
	}
}

func (s *CustomerService) CreateCustomer(data *dtos.CustomerUpsertDto) (*dtos.CustomerDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	customer := &domains.Customer{}
	automapper.Map(data, customer)
	customer.ID = 0
	createdCustomer, err := s.customerRepository.Create(customer)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating customer")
		return nil, dtos.NewDatabaseError(err)
	}
	customerDto := &dtos.CustomerDto{}
	automapper.Map(createdCustomer, customerDto)
	return customerDto, nil
}

func (s *CustomerService) UpdateCustomer(data *dtos.CustomerUpsertDto) (*dtos.CustomerDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	customer, err := s.customerRepository.Get(data.ID)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("datebase error while fetching customer by id")
		return nil, dtos.NewDatabaseError(err)
	}
	automapper.Map(data, customer)
	customer.LastUpdatedTime = time.Now().UnixMilli()
	updatedCustomer, err := s.customerRepository.Update(customer)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while updating customer")
		return nil, dtos.NewDatabaseError(err)
	}
	customerDto := &dtos.CustomerDto{}
	automapper.Map(updatedCustomer, customerDto)
	return customerDto, nil
}

func (s *CustomerService) GetAllCustomers() ([]*dtos.CustomerDto, *dtos.ErrorDto) {
	customers, err := s.customerRepository.GetAll()
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "all customers").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching all customers")
		return nil, dtos.NewDatabaseError(err)
	}
	customerDtos := make([]*dtos.CustomerDto, 0)
	automapper.Map(customers, &customerDtos)
	return customerDtos, nil
}

func (s *CustomerService) DeleteCustomer(id int) *dtos.ErrorDto {
	if err := s.customerRepository.Any("id=?", id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while checking customer existance by id")
		return dtos.NewDatabaseError(err)
	}
	if err := s.customerRepository.Delete(id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "customer delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while deleting customer")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
