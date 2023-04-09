package services

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/wire"
	"github.com/ketan-10/classroom/backend/entities"
	"github.com/ketan-10/classroom/backend/utils"
	"github.com/ketan-10/classroom/backend/xo_gen/repo"
	"github.com/ketan-10/classroom/backend/xo_gen/table"
	"github.com/pkg/errors"
)

type IAuthService interface {
	Login(ctx context.Context, email string, password string) (string, error)
	GetUserAndVerifyPassword(ctx context.Context, email string, password string) (*table.User, error)
	ParseToken(tokenStr string) (entities.TokenClaim, error)
}

type AuthService struct {
	UserRepository repo.IUserRepository
}

var NewAuthService = wire.NewSet(wire.Struct(new(AuthService), "*"), wire.Bind(new(IAuthService), new(AuthService)))

// Login Login for all users in the system
func (us *AuthService) Login(ctx context.Context, email string, password string) (string, error) {
	user, err := us.GetUserAndVerifyPassword(ctx, email, password)

	if err != nil {
		return "", errors.New("ErrUserDoesNotExist")
	}

	return us.CreateToken(user.ID, user.Email)
}

func (us *AuthService) CreateToken(id int, email string) (string, error) {
	expiredAt := time.Now().AddDate(0, 1, 0)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, entities.TokenClaim{
		UserID:    id,
		Email:     email,
		ExpiresAt: expiredAt,
		IssuedAt:  time.Now(),
	})

	return token.SignedString([]byte(utils.JwtSecret))
}

func (us *AuthService) GetUserAndVerifyPassword(ctx context.Context, email string, password string) (*table.User, error) {
	user, err := us.UserRepository.UserByEmailActive(ctx, email, true, nil)
	if err != nil {
		return nil, err
	}

	// TODO hash-password
	if password != user.Password.String {
		return nil, errors.New("ErrIncorrectPassword")
	}

	return &user, nil
}

func (us *AuthService) ParseToken(tokenStr string) (entities.TokenClaim, error) {
	var tokenClaim entities.TokenClaim
	_, err := jwt.ParseWithClaims(tokenStr, &tokenClaim, func(t *jwt.Token) (interface{}, error) {
		return []byte(utils.JwtSecret), nil
	})
	return tokenClaim, err
}
