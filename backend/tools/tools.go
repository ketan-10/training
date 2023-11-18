//go:build tools
// +build tools

package tools

import (
	_ "github.com/99designs/gqlgen"
  _ "github.com/google/wire/cmd/wire" 
  _ "github.com/pressly/goose/v3/cmd/goose"
  _ "github.com/ketan-10/go-fanout" 
)
