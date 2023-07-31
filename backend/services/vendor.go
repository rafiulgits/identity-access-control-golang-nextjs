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

type IVendorService interface {
	CreateVendor(data *dtos.VendorUpsertDto) (*dtos.VendorDto, *dtos.ErrorDto)
	UpdateVendor(data *dtos.VendorUpsertDto) (*dtos.VendorDto, *dtos.ErrorDto)
	GetAllVendors() ([]*dtos.VendorDto, *dtos.ErrorDto)
	DeleteVendor(id int) *dtos.ErrorDto
}

type VendorService struct {
	vendorRepository repositories.IVendorRepository
}

func NewVendorService() *VendorService {
	return &VendorService{
		vendorRepository: repositories.NewVendorRepository(),
	}
}

func (s *VendorService) CreateVendor(data *dtos.VendorUpsertDto) (*dtos.VendorDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	vendor := &domains.Vendor{}
	automapper.Map(data, vendor)
	vendor.ID = 0
	createdVendor, err := s.vendorRepository.Create(vendor)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor create").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while creating vendor")
		return nil, dtos.NewDatabaseError(err)
	}
	vendorDto := &dtos.VendorDto{}
	automapper.Map(createdVendor, vendorDto)
	return vendorDto, nil
}

func (s *VendorService) UpdateVendor(data *dtos.VendorUpsertDto) (*dtos.VendorDto, *dtos.ErrorDto) {
	if err := data.Validate(); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("data validation failed")
		return nil, dtos.NewValidationError(err)
	}
	vendor, err := s.vendorRepository.Get(data.ID)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("datebase error while fetching vendor by id")
		return nil, dtos.NewDatabaseError(err)
	}
	automapper.Map(data, vendor)
	vendor.LastUpdatedTime = time.Now().UnixMilli()
	updatedVendor, err := s.vendorRepository.Update(vendor)
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor update").
			Str("loc", util.GetExecLocation()).Any("payload", data).Err(err).Msg("database error while updating vendor")
		return nil, dtos.NewDatabaseError(err)
	}
	vendorDto := &dtos.VendorDto{}
	automapper.Map(updatedVendor, vendorDto)
	return vendorDto, nil
}

func (s *VendorService) GetAllVendors() ([]*dtos.VendorDto, *dtos.ErrorDto) {
	vendors, err := s.vendorRepository.GetAll()
	if err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "all vendors").
			Str("loc", util.GetExecLocation()).Err(err).Msg("datebase error while fetching all vendors")
		return nil, dtos.NewDatabaseError(err)
	}
	vendorDtos := make([]*dtos.VendorDto, 0)
	automapper.Map(vendors, &vendorDtos)
	return vendorDtos, nil
}

func (s *VendorService) DeleteVendor(id int) *dtos.ErrorDto {
	if err := s.vendorRepository.Any("id=?", id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while checking vendor existance by id")
		return dtos.NewDatabaseError(err)
	}
	if err := s.vendorRepository.Delete(id); err != nil {
		infra.
			GetInfra().Logger().Error().Str("layer", "service").Str("topic", "vendor delete").Str("loc", util.GetExecLocation()).
			Any("payload", id).Err(err).Msg("datebase error while deleting vendor")
		return dtos.NewDatabaseError(err)
	}
	return nil
}
