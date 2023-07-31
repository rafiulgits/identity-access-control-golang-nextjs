package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IProductRepository interface {
	IBaseRepository[int, domains.Product]
}

type ProductRepository struct {
	*BaseRepository[int, domains.Product]
}

func NewProductRepository() *ProductRepository {
	return &ProductRepository{
		NewBaseRepository[int, domains.Product](
			domains.ProductTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
