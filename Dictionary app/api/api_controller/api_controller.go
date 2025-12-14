package api_controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"darijapp-dictionary-api/logger"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type French struct {
	Id         int    `db:"id" json:"id"`
	Expression string `db:"expression" json:"expression"`
	Detail     string `db:"detail" json:"detail"`
}

type FrenchWithTranslations struct {
	Id           int             `db:"id" json:"id"`
	Expression   string          `db:"expression" json:"expression"`
	Detail       string          `db:"detail" json:"detail"`
	Translations json.RawMessage `db:"translations" json:"translations"`
}

type Arabic struct {
	Id                 int    `db:"id" json:"id"`
	ExpressionArabic   string `db:"expression_arabic" json:"expression_arabic"`
	ExpressionPhonetic string `db:"expression_phonetic" json:"expression_phonetic"`
	Variant            int    `db:"variant" json:"variant"`
}

type ArabicWtihTranslations struct {
	Id                 int             `db:"id" json:"id"`
	ExpressionArabic   string          `db:"expression_arabic" json:"expression_arabic"`
	ExpressionPhonetic string          `db:"expression_phonetic" json:"expression_phonetic"`
	Variant            int             `db:"variant" json:"variant"`
	Translations       json.RawMessage `db:"translations" json:"translations"`
}

type Translation struct {
	Id       int `db:"id" json:"id"`
	FrenchId int `db:"french_id" json:"french_id"`
	ArabicId int `db:"arabic_id" json:"arabic_id"`
}

var db *sqlx.DB

func SetDB(dbToSet *sql.DB) {
	db = sqlx.NewDb(dbToSet, "postgres")
}

func IntializeRouter() *mux.Router {
	router := mux.NewRouter()

	HandleFuncWithLogs(router, "/expressions/french", getAllFrench).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/frenchWithTranslations", getAllFrenchWithTranslations).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/french/{id}", getFrench).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/french", addFrench).Methods("POST")
	HandleFuncWithLogs(router, "/expressions/french/{id}", updateFrench).Methods("PUT")
	HandleFuncWithLogs(router, "/expressions/french/{id}", deleteFrench).Methods("DELETE")

	HandleFuncWithLogs(router, "/expressions/arabic", getAllArabic).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/arabicWithTranslations", getAllArabicWithTranslations).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/arabic/{id}", getArabic).Methods("GET")
	HandleFuncWithLogs(router, "/expressions/arabic", addArabic).Methods("POST")
	HandleFuncWithLogs(router, "/expressions/arabic/{id}", updateArabic).Methods("PUT")
	HandleFuncWithLogs(router, "/expressions/arabic/{id}", deleteArabic).Methods("DELETE")

	HandleFuncWithLogs(router, "/translations", getAllTranslation).Methods("GET")
	HandleFuncWithLogs(router, "/translations/{id}", getTranslation).Methods("GET")
	HandleFuncWithLogs(router, "/translations", addTranslation).Methods("POST")
	HandleFuncWithLogs(router, "/translations", deleteTranslationFromIds).Methods("DELETE")
	HandleFuncWithLogs(router, "/translations/{id}", deleteTranslation).Methods("DELETE")
	HandleFuncWithLogs(router, "/translations/search/from_french/{id}", searchTranslationFromFrench).Methods("GET")
	HandleFuncWithLogs(router, "/translations/search/from_arabic/{id}", searchTranslationFromArabic).Methods("GET")

	return router
}

func HandleFuncWithLogs(router *mux.Router, path string, f func(http.ResponseWriter, *http.Request) error) *mux.Route {
	routerFunc := func(w http.ResponseWriter, r *http.Request) {
		logger.Log(fmt.Sprint("Received request: ", r.Method, " ", r.RequestURI))
		err := f(w, r)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		logger.Log("Request executed successfully")
	}

	return router.HandleFunc(path, routerFunc)
}

// FRENCH TABLE

func getAllFrench(w http.ResponseWriter, r *http.Request) error {
	frenchItems := []French{}

	err := db.Select(&frenchItems, "SELECT * FROM french")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println(err.Error())
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frenchItems)
	return nil
}

func getAllFrenchWithTranslations(w http.ResponseWriter, r *http.Request) error {
	query := `
		SELECT 
			f.id,
			f.expression,
			f.detail,
			COALESCE(
				json_agg(
					json_build_object(
						'id', a.id,
						'expression_arabic', a.expression_arabic,
						'expression_phonetic', a.expression_phonetic,
						'variant', a.variant
					)
				) FILTER (WHERE a.id IS NOT NULL),
				'[]'::json
			) AS translations
		FROM 
			french f
		LEFT JOIN 
			translation t ON f.id = t.french_id
		LEFT JOIN 
			arabic a ON t.arabic_id = a.id
		GROUP BY 
			f.id, f.expression, f.detail
		ORDER BY 
			f.id
	`

	frenchItems := []FrenchWithTranslations{}

	err := db.Select(&frenchItems, query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frenchItems)
	return nil
}

func getFrench(w http.ResponseWriter, r *http.Request) error {
	arguments := mux.Vars(r)
	id := arguments["id"]

	var french French
	err := db.Get(&french, "SELECT * FROM french WHERE id = $1", id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
			return err
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(french)
	return nil
}

func addFrench(w http.ResponseWriter, r *http.Request) error {
	var french French
	err := json.NewDecoder(r.Body).Decode(&french)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	query := "INSERT INTO french (expression, detail) VALUES ($1, $2) RETURNING id"
	err = db.QueryRow(query, french.Expression, french.Detail).Scan(&french.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(french)
	return nil
}

func updateFrench(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	id := vars["id"]

	var french French
	err := json.NewDecoder(r.Body).Decode(&french)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	french.Id, _ = strconv.Atoi(id)

	query := "UPDATE french SET expression = :expression, detail = :detail WHERE id = :id"
	result, err := db.NamedExec(query, &french)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(french)
	return nil
}

func deleteFrench(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	id := vars["id"]

	result, err := db.Exec("DELETE FROM french WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.WriteHeader(http.StatusNoContent)
	return nil
}

// ARABIC TABLE

func getAllArabic(w http.ResponseWriter, r *http.Request) error {
	arabicItems := []Arabic{}

	err := db.Select(&arabicItems, "SELECT * FROM arabic")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(arabicItems)
	return nil
}

func getAllArabicWithTranslations(w http.ResponseWriter, r *http.Request) error {
	query := `
		SELECT 
			a.id,
			a.expression_arabic,
			a.expression_phonetic,
			a.variant,
			COALESCE(
				json_agg(
					json_build_object(
						'id', f.id,
						'expression', f.expression,
						'detail', f.detail
					)
				) FILTER (WHERE f.id IS NOT NULL),
				'[]'::json
			) AS translations
		FROM 
			arabic a
		LEFT JOIN 
			translation t ON a.id = t.arabic_id
		LEFT JOIN 
			french f ON t.french_id = f.id
		GROUP BY 
			a.id, a.expression_arabic, a.expression_phonetic, a.variant
		ORDER BY 
			a.id
	`

	arabicItems := []ArabicWtihTranslations{}

	err := db.Select(&arabicItems, query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(arabicItems)
	return nil
}

func getArabic(w http.ResponseWriter, r *http.Request) error {
	arguments := mux.Vars(r)
	id := arguments["id"]

	var arabic Arabic
	err := db.Get(&arabic, "SELECT * FROM arabic WHERE id = $1", id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
			return err
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(arabic)
	return nil
}

func addArabic(w http.ResponseWriter, r *http.Request) error {
	var arabic Arabic
	err := json.NewDecoder(r.Body).Decode(&arabic)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	query := "INSERT INTO arabic (expression_arabic, expression_phonetic, variant) VALUES ($1, $2, $3) RETURNING id"
	err = db.QueryRow(query, arabic.ExpressionArabic, arabic.ExpressionPhonetic, arabic.Variant).Scan(&arabic.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(arabic)
	return nil
}

func updateArabic(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	id := vars["id"]

	var arabic Arabic
	err := json.NewDecoder(r.Body).Decode(&arabic)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	arabic.Id, _ = strconv.Atoi(id)

	query := "UPDATE arabic SET expression_arabic = :expression_arabic, expression_phonetic = :expression_phonetic, variant = :variant WHERE id = :id"
	result, err := db.NamedExec(query, &arabic)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(arabic)
	return nil
}

func deleteArabic(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	id := vars["id"]

	result, err := db.Exec("DELETE FROM arabic WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.WriteHeader(http.StatusNoContent)
	return nil
}

// TRANSLATION TABLE

func getAllTranslation(w http.ResponseWriter, r *http.Request) error {
	translationItems := []Translation{}

	err := db.Select(&translationItems, "SELECT * FROM translation")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(translationItems)
	return nil
}

func getTranslation(w http.ResponseWriter, r *http.Request) error {
	arguments := mux.Vars(r)
	id := arguments["id"]

	var translation Translation
	err := db.Get(&translation, "SELECT * FROM translation WHERE id = $1", id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
			return err
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(translation)
	return nil
}

func addTranslation(w http.ResponseWriter, r *http.Request) error {
	var translation Translation
	err := json.NewDecoder(r.Body).Decode(&translation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	query := "INSERT INTO translation (french_id, arabic_id) VALUES ($1, $2) RETURNING id"
	err = db.QueryRow(query, translation.FrenchId, translation.ArabicId).Scan(&translation.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(translation)
	return nil
}

func deleteTranslationFromIds(w http.ResponseWriter, r *http.Request) error {
	var translation Translation
	err := json.NewDecoder(r.Body).Decode(&translation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	result, err := db.Exec("DELETE FROM translation WHERE french_id = $1 AND arabic_id = $2", translation.FrenchId, translation.ArabicId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.WriteHeader(http.StatusNoContent)
	return nil
}

func deleteTranslation(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	id := vars["id"]

	result, err := db.Exec("DELETE FROM translation WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Item not found", http.StatusNotFound)
		return err
	}

	w.WriteHeader(http.StatusNoContent)
	return nil
}

func searchTranslationFromFrench(w http.ResponseWriter, r *http.Request) error {
	arguments := mux.Vars(r)
	id := arguments["id"]

	arabicItems := []Arabic{}
	err := db.Select(&arabicItems, "SELECT a.* FROM translation t JOIN arabic a ON t.arabic_id = a.id WHERE t.french_id = $1;", id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
			return err
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(arabicItems)
	return nil
}

func searchTranslationFromArabic(w http.ResponseWriter, r *http.Request) error {
	arguments := mux.Vars(r)
	id := arguments["id"]

	frenchItems := []French{}
	err := db.Select(&frenchItems, "SELECT f.* FROM translation t JOIN french f ON t.french_id = f.id WHERE t.arabic_id = $1;", id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
			return err
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frenchItems)
	return nil
}
