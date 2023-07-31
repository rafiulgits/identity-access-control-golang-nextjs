package domains

type Account struct {
	ID           int    `gorm:"size:30;not null;primaryKey"`
	UserID       int    `gorm:"size:30;not null"`
	AuthProvider string `gorm:"type:varchar(10)"`
	Name         string `gorm:"type:varchar(150)"` // this could be phone, email
	Secret       string `gorm:"type:varchar(150)"` // this could be password or any user
	*BaseLog
}

const AccountTableName = "Accounts"

func (Account) TableName() string {
	return AccountTableName
}
