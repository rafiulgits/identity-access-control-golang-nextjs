package jsons

import (
	"database/sql/driver"
	"encoding/json"
)

type StringArray []string

// Value Marshal
func (a StringArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}

// Scan Unmarshal
func (a *StringArray) Scan(value interface{}) error {
	valueStr := value.(string)
	return json.Unmarshal([]byte(valueStr), a)
}
