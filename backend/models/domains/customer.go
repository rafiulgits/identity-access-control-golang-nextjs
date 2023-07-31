package domains

type Customer struct {
	ID      int    `gorm:"size:30;not null;primaryKey"`
	Name    string `gorm:"type:varchar(80);not null"`
	Code    string `gorm:"type:varchar(10);not null;unique"`
	Phone   string `gorm:"type:varchar(20)"`
	Address string `gorm:"type:varchar(100)"`
	*BaseLog
}

const CustomerTableName = "Customers"

func (Customer) TableName() string {
	return CustomerTableName
}
