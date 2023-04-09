package entities

import (
	"errors"
	"time"
)

type TokenClaim struct {
	UserID    int       `json:"id"`
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"expire_at"`
	IssuedAt  time.Time `json:"issued_at"`
}

func (t TokenClaim) Valid() error {
	if t.ExpiresAt.Before(time.Now()) {
		return errors.New("ErrAuthTokenTimeout")
	}
	return nil
}
