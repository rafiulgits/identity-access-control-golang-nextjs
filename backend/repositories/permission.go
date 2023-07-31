package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
)

type IPermissionRepository interface {
	IBaseRepository[int, domains.Permission]
}

type PermissionRepository struct {
	*BaseRepository[int, domains.Permission]
}

func NewPermissionRepository() *PermissionRepository {
	return &PermissionRepository{
		NewBaseRepository[int, domains.Permission](
			domains.PermissionTableName,
			infra.GetInfra().GetDatabase(),
			infra.GetInfra().Logger(),
		),
	}
}
