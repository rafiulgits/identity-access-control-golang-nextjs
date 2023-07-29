package errors

import (
	"errors"

	"gorm.io/gorm"
)

var (
	ErrSystemFailure   = errors.New("something went wrong, please contact with service provider")
	ErrInfraIsNotReady = errors.New("infra is not ready to use, please contact with service provider")
)

func IsDatabaseNotFoundError(err error) bool {
	return errors.Is(err, gorm.ErrRecordNotFound)
}

func NewError(msg string) error {
	return errors.New(msg)
}

func IsError(err, target error) bool {
	return errors.Is(err, target)
}
