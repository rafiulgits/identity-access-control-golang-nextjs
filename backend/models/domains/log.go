package domains

type BaseLog struct {
	CreatedTime     int64 `gorm:"autoCreateTime:milli;<-:create"`
	LastUpdatedTime int64 `gorm:"type:bigint;not null"`
}
