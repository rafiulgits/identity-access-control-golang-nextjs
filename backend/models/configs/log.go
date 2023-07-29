package configs

type LogConfig struct {
	FilePath        string `json:"filePath"`
	MaxAgeInDays    int    `json:"maxAgeInDays"`
	MaxFileSizeInMB int    `json:"maxFileSizeInMB"`
	MaxBackupFiles  int    `json:"maxBackupFiles"`
}
