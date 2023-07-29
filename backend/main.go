package main

import (
	"flag"

	"github.com/rafiulgits/identity-access-control/api"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/configs"
)

func main() {
	configs.LoadCoreConfig("./")

	dbMigration := flag.Bool("dbmigration", false, "Run with database migration")
	flag.Parse()

	if dbMigration != nil && *dbMigration {
		configs.GetConfig().DBMigration = *dbMigration
	}

	coreInfra := infra.NewInfra()
	if err := coreInfra.Ready(); err != nil {
		panic(err)
	}
	defer coreInfra.Down()

	api.Start()

}
