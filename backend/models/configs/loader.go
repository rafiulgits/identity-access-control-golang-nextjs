package configs

import (
	"encoding/json"
	"errors"
	"os"
	"path"
)

func LoadConfig[T any](root string) (*T, error) {
	if _, err := os.Stat(path.Join(root, "appsettings.local.json")); err == nil {
		filePath := path.Join(root, "appsettings.local.json")
		stream, err := os.Open(filePath)
		if err != nil {
			return nil, err
		}
		cfg := new(T)
		parseErr := json.NewDecoder(stream).Decode(cfg)
		if parseErr != nil {
			return nil, parseErr
		}
		return cfg, nil
	} else if errors.Is(err, os.ErrNotExist) {
		filePath := path.Join(root, "appsettings.json")
		stream, err := os.Open(filePath)
		if err != nil {
			return nil, err
		}
		cfg := new(T)
		parseErr := json.NewDecoder(stream).Decode(cfg)
		if parseErr != nil {
			return nil, parseErr
		}
		return cfg, nil
	} else {
		return nil, err
	}

}
