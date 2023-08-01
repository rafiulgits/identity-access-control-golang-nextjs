package dtos

import (
	"errors"
	"strings"

	"github.com/rafiulgits/identity-access-control/models/validator"
	"gorm.io/gorm"
)

type ErrorDto struct {
	Message   string      `json:"message"`
	Fields    interface{} `json:"fields,omitempty"`
	ErrorCode int         `json:"-"` //HTTP Status Code to indicate error type
}

func NewDefaultErrorDto(message string) *ErrorDto {
	return &ErrorDto{
		Message:   message,
		ErrorCode: 400,
	}
}

func NewErrorDto(message string, errCode int) *ErrorDto {
	return &ErrorDto{
		Message:   message,
		ErrorCode: errCode,
	}
}

func NewValidationError(err error) *ErrorDto {
	fields := validator.ParseModelErrors(err)
	if fields != nil {
		return &ErrorDto{
			Message:   "data validation failed",
			Fields:    fields,
			ErrorCode: 400,
		}
	}
	return &ErrorDto{
		Message:   err.Error(),
		ErrorCode: 400,
	}

}

func NewDatabaseError(err error) *ErrorDto {
	msg, code := inspectDbError(err)
	return &ErrorDto{
		Message:   msg,
		ErrorCode: code,
	}
}

func NewDatabaseErrorWithMessage(err error, message string) *ErrorDto {
	_, code := inspectDbError(err)
	return &ErrorDto{
		Message:   message,
		ErrorCode: code,
	}
}

func inspectDbError(err error) (string, int) {
	var msg string = "something went wrong while operating database"
	var code int = 500
	if errors.Is(gorm.ErrRecordNotFound, err) {
		msg = "no such record found"
		code = 404
	} else if errors.Is(gorm.ErrModelValueRequired, err) {
		code = 400
		msg = "invalid model relation value, please provide valid value"
	} else if strings.Contains(err.Error(), "SQLSTATE 23503") {
		code = 400
		msg = "the insert or update value of a foreign key is invalid, please provide valid value"
	} else if strings.Contains(err.Error(), "SQLSTATE 23505") {
		code = 400
		msg = "duplicate key value violates unique constraint"
	}

	return msg, code

}
