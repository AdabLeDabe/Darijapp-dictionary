package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

func ConnectToPostgreServer(host string, port int, user string, password string) (*sql.DB, error) {
	defaultDbName := "postgres"
	psqlInfo := getConnectionString(host, port, user, password, defaultDbName)

	db, err := connectAndPing(psqlInfo)
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func DatabaseExists(db *sql.DB, dbName string) (bool, error) {
	var dbExists bool
	query := "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1);"
	err := db.QueryRow(query, dbName).Scan(&dbExists)
	if err != nil {
		return false, err
	}

	return dbExists, nil
}

func CreateDatabase(baseDb *sql.DB) error {
	createDbSchema, err := os.ReadFile("./database/create_db.sql")
	if err != nil {
		return err
	}

	_, err = baseDb.Exec(string(createDbSchema))
	if err != nil {
		return err
	}

	return nil
}

func ConnectToDatabase(baseDb *sql.DB, host string, port int, user string, password string) (*sql.DB, error) {
	dbName := "darijapp_dictionary"
	psqlInfo := getConnectionString(host, port, user, password, dbName)

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

func getConnectionString(host string, port int, user string, password string, dbName string) string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbName)
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
