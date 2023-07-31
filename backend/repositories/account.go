package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IAccountRepository interface {
	IBaseRepository[int, domains.Account]
}

type AccountRepository struct {
	*BaseRepository[int, domains.Account]
}

func NewAccountRepository() *AccountRepository {
	return &AccountRepository{
		NewBaseRepository[int, domains.Account](
			domains.AccountTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
