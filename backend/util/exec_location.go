package util

import (
	"fmt"
	"runtime"
)

func GetExecLocation() string {
	_, filename, line, ok := runtime.Caller(1)
	if !ok {
		return ""
	}
	return fmt.Sprintf("%s[L%d]", filename, line)
}
