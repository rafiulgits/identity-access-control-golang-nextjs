package logger

import (
	"fmt"
	"time"

	"github.com/rafiulgits/identity-access-control/models/configs"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
	"gopkg.in/natefinch/lumberjack.v2"
)

func NewZeroLogFileLogger(cfg *configs.LogConfig) *zerolog.Logger {
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
	zerolog.TimeFieldFormat = time.RFC3339Nano

	filename := time.Now().Format("2006-01-02")
	fileLogger := &lumberjack.Logger{
		Filename:   fmt.Sprintf("%s/%s.log", cfg.FilePath, filename),
		MaxSize:    cfg.MaxFileSizeInMB,
		LocalTime:  true,
		MaxBackups: cfg.MaxBackupFiles,
		MaxAge:     cfg.MaxAgeInDays,
		Compress:   true,
	}

	var output = zerolog.MultiLevelWriter(fileLogger)

	log := zerolog.New(output).
		Level(zerolog.Level(zerolog.InfoLevel)).
		With().
		Timestamp().
		Logger()

	return &log
}
