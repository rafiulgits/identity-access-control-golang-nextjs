package main

import (
	"flag"

	"github.com/rafiulgits/identity-access-control/api"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/infra/seed"
	"github.com/rafiulgits/identity-access-control/models/configs"
)

func main() {
	configs.LoadCoreConfig("./")

	dbMigration := flag.Bool("dbmigration", false, "Run with database migration")
	setup := flag.Bool("setup", false, "Run with database migration")
	flag.Parse()

	if dbMigration != nil && *dbMigration {
		configs.GetConfig().DBMigration = *dbMigration
	}

	coreInfra := infra.NewInfra()
	if err := coreInfra.Ready(); err != nil {
		panic(err)
	}
	defer coreInfra.Down()

	if setup != nil && *setup {
		// create default all policies, default admin, assign policy to admin
		if err := seed.MasterData(); err != nil {
			panic(err)
		}
	}

	api.Start()

}
