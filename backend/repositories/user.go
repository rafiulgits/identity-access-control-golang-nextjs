package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IUserRepository interface {
	IBaseRepository[int, domains.User]
}

type UserRepository struct {
	*BaseRepository[int, domains.User]
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		NewBaseRepository[int, domains.User](
			domains.UserTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
