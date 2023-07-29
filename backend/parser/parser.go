package parser

import (
	"strconv"
)

func Int(val string) int {
	if val != "" {
		id, err := strconv.Atoi(val)
		if err != nil {
			return 0
		}
		return id
	}
	return 0

}

func Int64(val string) int64 {
	if val != "" {
		id, err := strconv.ParseInt(val, 10, 64)
		if err != nil {
			return 0
		}
		return id
	}
	return 0
}

func UInt(val string) uint {
	return uint(Int(val))
}
