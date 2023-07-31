package domains

type User struct {
	ID       int          `gorm:"size:30;not null;primaryKey"`
	Name     string       `gorm:"type:varchar(80);not null"`
	Account  []Account    `gorm:"foreignKey:UserID"`
	Policies []UserPolicy `gorm:"foreignKey:UserID"`
	*BaseLog
}

const UserTableName = "Users"

func (User) TableName() string {
	return UserTableName
}
