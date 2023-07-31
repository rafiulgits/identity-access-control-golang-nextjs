package domains

type Permission struct {
	ID       int    `gorm:"size:30;not null;primaryKey"`
	PolicyID int    `gorm:"size:30;not null;"`
	Access   int    `gorm:"size:30;not null"`
	Module   string `gorm:"type:varchar(30);not null"`
	*BaseLog
}

const PermissionTableName = "Permissions"

func (Permission) TableName() string {
	return PermissionTableName
}
