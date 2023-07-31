package domains

type Product struct {
	ID    int     `gorm:"size:30;not null;primaryKey"`
	Name  string  `gorm:"type:varchar(80);not null"`
	Code  string  `gorm:"type:varchar(10);not null;unique"`
	Price float64 `gorm:"type:float;not null"`
	*BaseLog
}

const ProductTableName = "Products"

func (Product) TableName() string {
	return ProductTableName
}
