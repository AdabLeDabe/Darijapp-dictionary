package main

import (
	"darijapp-dictionary-api/api_controller"
	"darijapp-dictionary-api/config"
	"darijapp-dictionary-api/database"
	"darijapp-dictionary-api/logger"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	config.LoadConfiguration()

	adminDb, appDb := InitializeDatabase()
	defer adminDb.Close()
	defer appDb.Close()

	api_controller.SetDB(appDb)
	router := api_controller.IntializeRouter()

	logger.Log("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

func InitializeDatabase() (*sql.DB, *sql.DB) {
	config := must(config.GetConfiguration())
	adminDb := must(database.ConnectToPostgreServer())
	logger.Log("Successfully connected to postgre server.")

	dbExists := must(database.DatabaseExists(adminDb))

	var appDb *sql.DB

	if dbExists {
		logger.Log(fmt.Sprint("The database ", config.DbName, " exists."))
		appDb = must(database.ConnectToDatabase(adminDb))
		logger.Log(fmt.Sprint("Successfully connected to database ", config.DbName))
	} else {
		logger.Log(fmt.Sprint("The database ", config.DbName, " does not exist."))
		mustWithNoReturn(database.CreateDatabase(adminDb))
		appDb = must(database.ConnectToDatabase(adminDb))
		mustWithNoReturn(database.CreateTables(appDb))
		logger.Log(fmt.Sprint("Successfully created database ", config.DbName, " and its tables."))
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
