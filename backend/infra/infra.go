package infra

import (
	"fmt"
	"log"

	"github.com/rafiulgits/identity-access-control/infra/db"
	"github.com/rafiulgits/identity-access-control/logger"
	"github.com/rafiulgits/identity-access-control/models/configs"
	"github.com/rafiulgits/identity-access-control/models/validator"
	"github.com/rs/zerolog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type IInfra interface {
	Ready() error
	GetDatabase() *db.DB
	Logger() *zerolog.Logger
	Down() error
}

type Infra struct {
	database *db.DB
	logger   *zerolog.Logger
}

var coreInfra *Infra

func GetInfra() *Infra {
	return coreInfra
}

func NewInfra() *Infra {
	coreInfra = &Infra{}
	return coreInfra
}

func (i *Infra) Ready() error {
	i.connectDatabase()
	validator.Initialize()
	i.logger = logger.NewZeroLogFileLogger(configs.GetConfig().Log)
	return nil
}

func (i *Infra) Down() error {
	i.database = nil
	return nil
}

func (i *Infra) GetDatabase() *db.DB {
	return i.database
}

func (i *Infra) Logger() *zerolog.Logger {
	return i.logger
}

func (i *Infra) connectDatabase() {
	conf := configs.GetConfig()
	dbConf := conf.DB
	gormCfg := &gorm.Config{
		DisableNestedTransaction: true,
		SkipDefaultTransaction:   true,
	}

	if conf.DebugEnv {
		gormCfg.Logger = logger.GormLogger()
	}

	connString := fmt.Sprintf("host=%s dbname=%s  port=%d user=%s password=%s sslmode=disable TimeZone=Asia/Dhaka",
		dbConf.Server, dbConf.DbName, dbConf.Port, dbConf.User, dbConf.Password)

	gormDb, err := gorm.Open(postgres.Open(connString), gormCfg)
	if err != nil {
		panic(err)
	}
	i.database = &db.DB{
		DB: gormDb,
	}

	log.Println("postgresql connected")
	if conf.DBMigration {
		i.dbMigration()
	}
}

func (i *Infra) dbMigration() {
	i.database.AutoMigrate()
}
