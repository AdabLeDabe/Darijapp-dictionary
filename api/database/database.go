package database

import (
	"darijapp-dictionary-api/config"
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func ConnectToPostgreServer() (*sql.DB, error) {
	config, err := config.GetConfiguration()
	if err != nil {
		return nil, err
	}

	defaultDbName := "postgres"
	psqlInfo := getConnectionString(config, defaultDbName)

	db, err := connectAndPing(psqlInfo)
	if err != nil {
		if db != nil {
			db.Close()
		}
		return nil, err
	}

	return db, nil
}

func DatabaseExists(db *sql.DB) (bool, error) {
	config, err := config.GetConfiguration()
	if err != nil {
		return false, err
	}

	var dbExists bool
	query := "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1);"
	err = db.QueryRow(query, config.DbName).Scan(&dbExists)
	if err != nil {
		return false, err
	}

	return dbExists, nil
}

func CreateDatabase(baseDb *sql.DB) error {
	config, err := config.GetConfiguration()
	if err != nil {
		return err
	}

	createDbScript := fmt.Sprintf("CREATE DATABASE %s ENCODING 'UTF8';", config.DbName)
	_, err = baseDb.Exec(createDbScript)
	if err != nil {
		return err
	}

	return nil
}

func ConnectToDatabase(baseDb *sql.DB) (*sql.DB, error) {
	config, err := config.GetConfiguration()
	if err != nil {
		return nil, err
	}

	psqlInfo := getConnectionString(config, config.DbName)

	appDb, err := connectAndPing(psqlInfo)
	if err != nil {
		appDb.Close()
		return nil, err
	}

	return appDb, nil
}

func CreateTables(appDb *sql.DB) error {
	createTablesSchema, err := os.ReadFile("./database/create_tables.sql")
	if err != nil {
		return err
	}

	_, err = appDb.Exec(string(createTablesSchema))
	if err != nil {
		return err
	}

	return nil
}

func getConnectionString(cfg config.Config, dbName string) string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, dbName)
}

func connectAndPing(connectionString string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
