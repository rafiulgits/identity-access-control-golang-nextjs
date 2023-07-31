package repositories

import (
	"github.com/rafiulgits/identity-access-control/infra/db"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
)

type EntityID interface {
	int | int8 | int16 | int32 | int64 |
		uint | uint8 | uint16 | uint32 | uint64 | uintptr
}

type IBaseRepository[T1 EntityID, T2 any] interface {
	Get(id T1) (*T2, error)
	GetAll() ([]*T2, error)
	GetByFilter(filter interface{}, args ...interface{}) (*T2, error)
	GetAllByFilter(filter interface{}, args ...interface{}) ([]*T2, error)
	Create(entity *T2) (*T2, error)
	Update(entity *T2) (*T2, error)
	Delete(id T1) error
	DeleteWithFilter(query interface{}, args ...interface{}) error
	GetQueryable() *gorm.DB
	Count(query interface{}, args ...interface{}) (int64, error)
	Any(query interface{}, args ...interface{}) error
	Includes(names ...string) IBaseRepository[T1, T2]
	Include(names string, args ...interface{}) IBaseRepository[T1, T2]
	CreateBulk(entities []*T2) ([]*T2, error)
	Order(val interface{}) IBaseRepository[T1, T2]
}

type BaseRepository[T1 EntityID, T2 any] struct {
	tableName string
	_db       *gorm.DB
	logger    *zerolog.Logger
}

func NewBaseRepository[T1 EntityID, T2 any](tableName string, dbInstance *db.DB, logger *zerolog.Logger) *BaseRepository[T1, T2] {
	return &BaseRepository[T1, T2]{
		tableName: tableName,
		_db:       dbInstance.Table(tableName),
		logger:    logger,
	}
}

func (repo *BaseRepository[T1, T2]) collection() *gorm.DB {
	return repo._db.Session(&gorm.Session{})
}

func (repo *BaseRepository[T1, T2]) Get(id T1) (*T2, error) {
	var entity T2
	err := repo.collection().First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (repo *BaseRepository[T1, T2]) GetAll() ([]*T2, error) {
	var entities []*T2
	err := repo.collection().Find(&entities).Error
	if err != nil {
		return nil, err
	}
	return entities, nil
}

func (repo *BaseRepository[T1, T2]) GetByFilter(filter interface{}, args ...interface{}) (*T2, error) {
	var entity T2
	err := repo.collection().Where(filter, args...).First(&entity).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

func (repo *BaseRepository[T1, T2]) GetAllByFilter(filter interface{}, args ...interface{}) ([]*T2, error) {
	var entities []*T2
	err := repo.collection().Where(filter, args...).Find(&entities).Error
	if err != nil {
		return nil, err
	}
	return entities, nil
}

func (repo *BaseRepository[T1, T2]) Create(entity *T2) (*T2, error) {
	if err := repo.collection().Create(&entity).Error; err != nil {
		return nil, err
	}
	repo.logger.Info().Str("layer", "repository").Str("table", repo.tableName).Str("op", "created").Any("payload", &entity).Send()
	return entity, nil
}

func (repo *BaseRepository[T1, T2]) Update(entity *T2) (*T2, error) {
	if err := repo.collection().Save(&entity).Error; err != nil {
		return nil, err
	}
	repo.logger.Info().Str("layer", "repository").Str("table", repo.tableName).Str("op", "updated").Any("payload", &entity).Send()
	return entity, nil
}

func (repo *BaseRepository[T1, T2]) Delete(id T1) error {
	if err := repo.collection().Delete(new(T2), id).Error; err != nil {
		return err
	}
	repo.logger.Info().Str("layer", "repository").Str("table", repo.tableName).Str("op", "deleted").Any("payload", id).Send()
	return nil
}

func (repo *BaseRepository[T1, T2]) DeleteWithFilter(query interface{}, args ...interface{}) error {
	if err := repo.collection().Where(query, args...).Delete(new(T2)).Error; err != nil {
		return err
	}
	repo.logger.Info().Str("layer", "repository").Str("table", repo.tableName).Str("op", "deleted with filter").Any("query", query).Any("args", args).Send()
	return nil
}

func (repo *BaseRepository[T1, T2]) Count(filter interface{}, args ...interface{}) (int64, error) {
	var count int64
	err := repo.collection().Where(filter, args...).Count(&count).Error
	if err != nil {
		return -1, err
	}

	return count, nil
}

func (repo *BaseRepository[T1, T2]) Any(filter interface{}, args ...interface{}) error {
	count, err := repo.Count(filter, args...)
	if err != nil {
		return err
	}
	if count == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (repo *BaseRepository[T1, T2]) GetQueryable() *gorm.DB {
	return repo.collection()
}

func (repo *BaseRepository[T1, T2]) preloads(preloads ...string) *gorm.DB {
	dbsession := repo.collection()

	for _, preload := range preloads {
		dbsession = dbsession.Preload(preload)
	}

	return dbsession
}

func (repo *BaseRepository[T1, T2]) Includes(names ...string) IBaseRepository[T1, T2] {
	return &BaseRepository[T1, T2]{
		tableName: repo.tableName,
		_db:       repo.preloads(names...),
	}
}

func (repo *BaseRepository[T1, T2]) Include(names string, args ...interface{}) IBaseRepository[T1, T2] {
	return &BaseRepository[T1, T2]{
		_db: repo.collection().Preload(names, args...),
	}
}

func (repo *BaseRepository[T1, T2]) CreateBulk(entities []*T2) ([]*T2, error) {
	if err := repo.collection().CreateInBatches(entities, len(entities)).Error; err != nil {
		return nil, err
	}
	return entities, nil
}

func (repo *BaseRepository[T1, T2]) Order(val interface{}) IBaseRepository[T1, T2] {
	return &BaseRepository[T1, T2]{
		_db: repo.collection().Order(val),
	}
}
