package api

import (
	"fmt"
	"log"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/configs"
)

func Start() {
	conf := configs.GetConfig()
	echoServer := echo.New()

	echoServer.HideBanner = !conf.DebugEnv
	echoServer.Debug = conf.DebugEnv

	echoServer.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     conf.Cors.AllowedOrigins,
		AllowMethods:     conf.Cors.AllowedMethods,
		AllowHeaders:     conf.Cors.AllowedHeaders,
		AllowCredentials: conf.Cors.AllowCredentials,
	}))

	echoServer.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:           true,
		LogStatus:        true,
		LogRemoteIP:      true,
		LogMethod:        true,
		LogContentLength: true,
		LogResponseSize:  true,
		LogError:         true,
		LogProtocol:      true,
		LogValuesFunc: func(_ echo.Context, v middleware.RequestLoggerValues) error {
			infra.GetInfra().Logger().Info().Str("layer", "api").Str("proto", v.Protocol).
				Int("status", v.Status).Str("method", v.Method).Str("uri", v.URI).
				Int64("responseSize", v.ResponseSize).Dur("duration", time.Since(v.StartTime)).
				Err(v.Error).Send()
			if conf.DebugEnv {
				log.Println(v.Protocol, v.Method, v.URI, v.Status, time.Since(v.StartTime).String())
			}
			return nil
		},
	}))

	if !conf.DebugEnv {
		echoServer.Use(middleware.Recover())
	}

	middleware.ErrJWTMissing.Code = 401

	serverAddress := fmt.Sprintf(":%d", conf.ListenPort)
	echoServer.Logger.Fatal(echoServer.Start(serverAddress))
}
