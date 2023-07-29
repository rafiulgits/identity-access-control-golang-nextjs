package configs

type CoreConfig struct {
	ListenPort      int         `json:"listenPort"`
	AccessTTLInHour int         `json:"accessTTLInHour"`
	DebugEnv        bool        `json:"debug"`
	DBMigration     bool        `json:"dbMigration"`
	Secret          string      `json:"secret"`
	DB              *DBConfig   `json:"db"`
	Log             *LogConfig  `json:"logging"`
	Cors            *CorsConfig `json:"cors"`
}

var coreConfig *CoreConfig

func GetConfig() *CoreConfig {
	return coreConfig
}

func LoadCoreConfig(dir string) {
	cfg, err := LoadConfig[CoreConfig](dir)
	if err != nil {
		panic(err)
	}
	coreConfig = cfg
}
