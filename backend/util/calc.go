package util

import (
	"math"
)

const STD_FLOAT64_TOLERANCE float64 = 0.001

func Float64Equal(a, b float64, tolerance float64) bool {
	if diff := math.Abs(a - b); diff < tolerance {
		return true
	}
	return false
}
