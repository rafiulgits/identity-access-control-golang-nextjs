package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IPolicyRepository interface {
	IBaseRepository[int, domains.Policy]
}

type PolicyRepository struct {
	*BaseRepository[int, domains.Policy]
}

func NewPolicyRepository() *PolicyRepository {
	return &PolicyRepository{
		NewBaseRepository[int, domains.Policy](
			domains.PolicyTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
