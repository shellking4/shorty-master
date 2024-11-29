package main

import (
	"log"
	"net/http"
	"net/url"
    "github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
	"github.com/teris-io/shortid"
	"crypto/rand"
	"encoding/base64"
	"strings"
)

type UrlShortenRequest struct {
	URL string `json:"url"`
}

type UrlShortenResponse struct {
	OriginalURL string `json:"original_url"`
	ShortURL    string `json:"short_url"`
	ShortCode   string `json:"short_code"`
}

func registerUrlShortenerRoutes(app *pocketbase.PocketBase) {
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// URL Shortener Endpoint
		se.Router.POST("/api/shorten", func(e *core.RequestEvent) error {
			// Parse request
			var req UrlShortenRequest
			if err := e.BindBody(&req); err != nil {
				return e.JSON(http.StatusBadRequest, map[string]string{
					"error": "Invalid request",
				})
			}

			// Validate URL
			if !isValidURL(req.URL) {
				return e.JSON(http.StatusBadRequest, map[string]string{
					"error": "Invalid URL",
				})
			}

			// Generate short code
			// shortCode := generateShortCode()
			shortCode := generateUniqueCode()


			// Prepare collection
			collection, err := app.FindCollectionByNameOrId("shortened_urls")
			if err != nil {
				return e.JSON(http.StatusInternalServerError, map[string]string{
					"error": "Collection not found",
				})
			}

			// Create new record
			record := core.NewRecord(collection)
			record.Set("original_url", req.URL)
			record.Set("short_code", shortCode)
			record.Set("clicks", 0)

			// Save record
			if err := app.Save(record); err != nil {
				return e.JSON(http.StatusInternalServerError, map[string]string{
					"error": "Failed to save URL",
				})
			}

			request := e.Request

			scheme := request.Header.Get("X-Forwarded-Proto")
			// If X-Forwarded-Proto is not set, check if it's HTTPS
			if scheme == "" {
				if request.TLS != nil {
					scheme = "https"
				} else {
					scheme = "http"
				}
			}

			// Construct short URL
    		baseURL := scheme + "://" + request.Host + "/"
			shortURL := baseURL + shortCode

			return e.JSON(http.StatusCreated, UrlShortenResponse{
				OriginalURL: req.URL,
				ShortURL:    shortURL,
				ShortCode:   shortCode,
			})
		}).Bind(apis.RequireAuth())

		// Redirect Endpoint
		se.Router.GET("/{code}", func(e *core.RequestEvent) error {
			shortCode := e.Request.PathValue("code")

			// Find record by short code
			record, err := app.FindFirstRecordByFilter(
				"shortened_urls", 
				"short_code = {:code}", 
				map[string]any{"code": shortCode},
			)
			if err != nil {
				return e.Redirect(http.StatusTemporaryRedirect, "/404")
			}

			// Increment clicks
			clicks := record.GetInt("clicks")
			record.Set("clicks", clicks+1)
			if err := app.Save(record); err != nil {
				// Log error but don't interrupt redirect
				app.Logger().Error("Error updating clicks", "error", err)
			}

			// Redirect to original URL
			return e.Redirect(http.StatusTemporaryRedirect, record.GetString("original_url"))
		})

		return se.Next()
	})
}

// isValidURL validates the given URL
func isValidURL(str string) bool {
	u, err := url.Parse(str)
	return err == nil && u.Scheme != "" && u.Host != ""
}

// generateShortCode creates a unique short code
func generateShortCode() string {
	// Using shortid to generate a unique, short identifier
	return shortid.MustGenerate()
}

func generateUniqueCode() string {
	// Generate 24 random bytes
	b := make([]byte, 30)
	_, err := rand.Read(b)
	if err != nil {
		return ""
	}
	
	// Convert to base64 and make URL-safe
	code := base64.URLEncoding.EncodeToString(b)
	
	// Remove padding and replace URL-unsafe characters
	code = strings.TrimRight(code, "=")
	code = strings.ReplaceAll(code, "+", "-")
	code = strings.ReplaceAll(code, "/", "_")
	
	return code
}

// In your main initialization
func main() {
	app := pocketbase.New()

	// Register URL shortener routes
	registerUrlShortenerRoutes(app)

	if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}