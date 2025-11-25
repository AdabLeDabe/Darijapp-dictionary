package logger

import (
	"fmt"
	"time"
)

func Log(message string) {
	now := time.Now().UTC()
	fmt.Println(fmt.Sprintf("[%s]", now.Format(time.RFC3339)), message)
}
