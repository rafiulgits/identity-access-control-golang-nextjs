package domains

type Policy struct {
	ID          int          `gorm:"size:30;not null;primaryKey"`
	Name        string       `gorm:"type:varchar(80);not null"`
	Permissions []Permission `gorm:"foreignKey:PolicyID"`
	*BaseLog
}

const PolicyTableName = "Policies"

func (Policy) TableName() string {
	return PolicyTableName
}
