package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type ICustomerRepository interface {
	IBaseRepository[int, domains.Customer]
}

type CustomerRepository struct {
	*BaseRepository[int, domains.Customer]
}

func NewCustomerRepository() *CustomerRepository {
	return &CustomerRepository{
		NewBaseRepository[int, domains.Customer](
			domains.CustomerTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
