package domains

import "github.com/rafiulgits/identity-access-control/models/jsons"

type Permission struct {
	ID       int               `gorm:"size:30;not null;primaryKey"`
	PolicyID int               `gorm:"size:30;not null;"`
	Access   jsons.StringArray `gorm:"type:text;not null"`
	Module   string            `gorm:"type:varchar(30);not null"`
	*BaseLog
}

const PermissionTableName = "Permissions"

func (Permission) TableName() string {
	return PermissionTableName
}
