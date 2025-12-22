package helper

import "strings"

func IsBlank(s string) bool {
	return strings.TrimSpace(s) == ""
}
