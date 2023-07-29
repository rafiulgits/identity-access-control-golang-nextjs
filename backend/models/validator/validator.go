package validator

import (
	"fmt"
	"net/mail"
	"reflect"
	"regexp"
	"strings"

	lib "github.com/go-playground/validator/v10"
)

var Validate *lib.Validate

func Initialize() {
	v := lib.New()
	v.RegisterValidation("optional_email", optionalEmailValidation)
	v.RegisterValidation("std_name", standardNameRegexValidation)
	v.RegisterValidation("bd_mobile_number", standardNameRegexValidation)
	v.RegisterTagNameFunc(configureFieldNameConvention)
	Validate = v
}

func configureFieldNameConvention(field reflect.StructField) string {
	name := strings.SplitN(field.Tag.Get("json"), ",", 2)[0]
	if name == "-" {
		return ""
	}
	return name
}

// @param err must be `ValidationErrors` type
func ParseModelErrors(err error) []map[string]string {
	validationErr, ok := err.(lib.ValidationErrors)
	if !ok {
		return nil
	}
	fieldErrs := make([]map[string]string, 0)
	for _, e := range validationErr {
		var msg string
		switch e.Tag() {
		case requireFailed:
			msg = "This field is required"
		case maxLengthFailed:
			msg = fmt.Sprintf("Maximum %s %s allowed", e.Param(), getTypeAlias(e.Type()))
		case minLengthFailed:
			msg = fmt.Sprintf("Minimum %s %s required", e.Param(), getTypeAlias(e.Type()))
		case emailFailed, optionalEmailFailed:
			msg = "Invalid email address"
		case lengthFailed:
			msg = fmt.Sprintf("Length should be %s", e.Param())
		case greaterThanFailed:
			msg = fmt.Sprintf("Should be greather than %s", e.Param())
		default:
			msg = e.Error()
		}
		fieldErrs = append(fieldErrs, map[string]string{e.Field(): msg})
	}
	return fieldErrs
}

const requireFailed = "required"
const maxLengthFailed = "max"
const minLengthFailed = "min"
const lengthFailed = "len"
const emailFailed = "email"
const optionalEmailFailed = "optional_email"
const greaterThanFailed = "gt"

func getTypeAlias(t reflect.Type) string {
	switch t.Kind() {
	case reflect.String:
		return "character(s)"
	case reflect.Float32, reflect.Float64,
		reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64,
		reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return "value"
	default:
		return "item(s)"
	}
}

func optionalEmailValidation(field lib.FieldLevel) bool {
	if field.Field().Kind() != reflect.String {
		return false
	}
	if field.Field().Len() == 0 {
		return true
	}
	_, err := mail.ParseAddress(field.Field().String())
	return err == nil
}

/*
string start with alpha, end with alpha numeric
can have alphanumeric, space, dash, underscore in middle
*/
func standardNameRegexValidation(field lib.FieldLevel) bool {
	if field.Field().Kind() != reflect.String {
		return false
	}

	regex := regexp.MustCompile(`^[^\s].+[a-zA-Z0-9 _-]+[^\s]$`)
	return regex.MatchString(field.Field().String())
}

func bdMobileNumberValidation(field lib.FieldLevel) bool {
	if field.Field().Kind() != reflect.String {
		return false
	}

	regex := regexp.MustCompile("^(\\+88)(01[3-9]\\d{8})$")
	return regex.MatchString(field.Field().String())
}
