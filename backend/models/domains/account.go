package domains

import (
	"golang.org/x/crypto/bcrypt"
)

type Account struct {
	ID           int    `gorm:"size:30;not null;primaryKey"`
	UserID       int    `gorm:"size:30;not null"`
	AuthProvider string `gorm:"type:varchar(10)"`
	Name         string `gorm:"type:varchar(150);unique"` // this could be phone, email
	Secret       string `gorm:"type:varchar(150)"`        // this could be password or any user
	*BaseLog
}

const AccountTableName = "Accounts"

func (Account) TableName() string {
	return AccountTableName
}

func (account *Account) SetPassword(rawPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	account.Secret = string(hashedPassword)
	return nil
}

func (account *Account) CheckIfPasswordIsCorrect(rawPassword string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(account.Secret), []byte(rawPassword)); err != nil {
		return false
	}
	return true
}
