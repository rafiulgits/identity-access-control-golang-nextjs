package domains

type UserPolicy struct {
	UserID   int     `gorm:"size:30;primaryKey;autoIncrement:false"`
	PolicyID int     `gorm:"size:30;primaryKey;autoIncrement:false"`
	Policy   *Policy `gorm:"foreignKey:PolicyID"`
}

const UserPolicyTableName = "UserPolicies"

func (UserPolicy) TableName() string {
	return UserPolicyTableName
}
