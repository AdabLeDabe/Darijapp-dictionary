package config

import (
	"bufio"
	"darijapp-dictionary-api/logger"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DbName   string
}

var loadedConfig *Config

var ErrNotInitialized = errors.New("Config was not initialized.")

func LoadConfiguration() {
	logger.Log("Loading configuration")
	rawConfig, err := readConfigFile("api.config")
	if err != nil {
		logger.Log("No configuration file found, using default config")
		loadedConfig = &Config{
			Host:     "localhost",
			Port:     5432,
			User:     "admin_user",
			Password: "le_admin",
			DbName:   "darijapp_dictionary",
		}
		return
	}

	var port int
	port, err = strconv.Atoi(rawConfig["PORT"])
	if err != nil {
		logger.Log(fmt.Sprintf("Invalid port '%s', using default port 5432", rawConfig["PORT"]))
		port = 5432
	}

	loadedConfig = &Config{
		Host:     rawConfig["HOSTNAME"],
		Port:     port,
		User:     rawConfig["USERNAME"],
		Password: rawConfig["PASSWORD"],
		DbName:   rawConfig["DATABASE"],
	}
	logger.Log("Successfully loaded configuration")
}

func GetConfiguration() (Config, error) {
	if loadedConfig == nil {
		return *loadedConfig, ErrNotInitialized
	}

	return *loadedConfig, nil
}

func readConfigFile(filename string) (map[string]string, error) {
	config := make(map[string]string)

	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		// Skip comments and blank lines
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		idx := strings.Index(line, "=")
		if idx == -1 {
			continue // Or handle error for bad lines
		}
		key := strings.TrimSpace(line[:idx])
		value := strings.TrimSpace(line[idx+1:])
		config[key] = value
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return config, nil
}
