package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IUserPolicyRepository interface {
	IBaseRepository[int, domains.UserPolicy]
}

type UserPolicyRepository struct {
	*BaseRepository[int, domains.UserPolicy]
}

func NewUserPolicyRepository() *UserPolicyRepository {
	return &UserPolicyRepository{
		NewBaseRepository[int, domains.UserPolicy](
			domains.UserPolicyTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
