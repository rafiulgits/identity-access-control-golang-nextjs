package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IVendorRepository interface {
	IBaseRepository[int, domains.Vendor]
}

type VendorRepository struct {
	*BaseRepository[int, domains.Vendor]
}

func NewVendorRepository() *VendorRepository {
	return &VendorRepository{
		NewBaseRepository[int, domains.Vendor](
			domains.VendorTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
