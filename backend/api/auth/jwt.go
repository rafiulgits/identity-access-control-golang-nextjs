package auth

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rafiulgits/identity-access-control/models/configs"
)

const UserKey = "user"

type User struct {
	UserID int `json:"userId"`
}

type jwtCustomClaims struct {
	User
	jwt.StandardClaims
}

func GenerateToken(userId int) (string, error) {
	conf := configs.GetConfig()
	claims := &jwtCustomClaims{
		User{
			UserID: userId,
		},
		jwt.StandardClaims{
			Issuer:    "IdentityServer",
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(conf.AccessTTLInHour)).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(conf.Secret))
	if err != nil {
		return "", err
	}

	return t, nil
}

func JwtAuth(next echo.HandlerFunc) echo.HandlerFunc {
	conf := configs.GetConfig()
	config := middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte(conf.Secret),
	}

	withJwtAuth := middleware.JWTWithConfig(config)
	return withJwtAuth(next)
}

func GetUserClaims(c echo.Context) *User {
	d := c.Get(UserKey).(*jwt.Token)
	claims := (d.Claims).(*jwtCustomClaims)
	return &claims.User
}
