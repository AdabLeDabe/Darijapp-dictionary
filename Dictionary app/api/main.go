package main

import (
	"darijapp-dictionary-api/api_controller"
	"darijapp-dictionary-api/database"
	"darijapp-dictionary-api/logger"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	adminDb, appDb := InitializeDatabase()
	api_controller.SetDB(appDb)
	router := api_controller.IntializeRouter()

	logger.Log("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))

	defer adminDb.Close()
	defer appDb.Close()
}

func InitializeDatabase() (*sql.DB, *sql.DB) {
	adminDb := must(database.ConnectToPostgreServer("localhost", 5432, "admin_user", "le_admin"))
	logger.Log("Successfully connected to postgre server.")

	dbName := "darijapp_dictionary"

	dbExists := must(database.DatabaseExists(adminDb, dbName))

	var appDb *sql.DB

	if dbExists {
		logger.Log(fmt.Sprint("The database ", dbName, " exists."))
		appDb = must(database.ConnectToDatabase(adminDb, "localhost", 5432, "admin_user", "le_admin"))
		logger.Log(fmt.Sprint("Successfully connected to database ", dbName))
	} else {
		logger.Log(fmt.Sprint("The database ", dbName, " does not exist."))
		mustWithNoReturn(database.CreateDatabase(adminDb))
		appDb = must(database.ConnectToDatabase(adminDb, "localhost", 5432, "admin_user", "le_admin"))
		mustWithNoReturn(database.CreateTables(appDb))
		logger.Log(fmt.Sprint("Successfully created database ", dbName, " and its tables."))
	}

	return adminDb, appDb
}

func must[T any](val T, err error) T {
	mustWithNoReturn(err)
	return val
}

func mustWithNoReturn(err error) {
	if err != nil {
		logger.Log(fmt.Sprint(err.Error()))
		os.Exit(1)
	}
}
