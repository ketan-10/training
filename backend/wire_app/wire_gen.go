// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package wire_app

import (
	"context"
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/graphql"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/middlewares"
	"github.com/ketan-10/training/backend/services"
	"github.com/ketan-10/training/backend/xo_gen"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/rlts"
)

// Injectors from wire.go:

func GetApp(ctx context.Context) (*App, func(), error) {
	dbOptions := &internal.DBOptions{}
	db := internal.OpenConnection(ctx, dbOptions)
	attendancesRepositoryQueryBuilder := &repo.AttendancesRepositoryQueryBuilder{}
	attendancesRepository := &repo.AttendancesRepository{
		DB:           db,
		QueryBuilder: attendancesRepositoryQueryBuilder,
	}
	trainingEventRepositoryQueryBuilder := &repo.TrainingEventRepositoryQueryBuilder{}
	trainingEventRepository := &repo.TrainingEventRepository{
		DB:           db,
		QueryBuilder: trainingEventRepositoryQueryBuilder,
	}
	studentsRepositoryQueryBuilder := &repo.StudentsRepositoryQueryBuilder{}
	studentsRepository := &repo.StudentsRepository{
		DB:           db,
		QueryBuilder: studentsRepositoryQueryBuilder,
	}
	attendancesRltsRepository := &rlts.AttendancesRltsRepository{
		TrainingEventRepository: trainingEventRepository,
		StudentsRepository:      studentsRepository,
	}
	registrationsRepositoryQueryBuilder := &repo.RegistrationsRepositoryQueryBuilder{}
	registrationsRepository := &repo.RegistrationsRepository{
		DB:           db,
		QueryBuilder: registrationsRepositoryQueryBuilder,
	}
	trainingRepositoryQueryBuilder := &repo.TrainingRepositoryQueryBuilder{}
	trainingRepository := &repo.TrainingRepository{
		DB:           db,
		QueryBuilder: trainingRepositoryQueryBuilder,
	}
	registrationsRltsRepository := &rlts.RegistrationsRltsRepository{
		TrainingRepository: trainingRepository,
		StudentsRepository: studentsRepository,
	}
	userRepositoryQueryBuilder := &repo.UserRepositoryQueryBuilder{}
	userRepository := &repo.UserRepository{
		DB:           db,
		QueryBuilder: userRepositoryQueryBuilder,
	}
	trainerTrainingMappingRepositoryQueryBuilder := &repo.TrainerTrainingMappingRepositoryQueryBuilder{}
	trainerTrainingMappingRepository := &repo.TrainerTrainingMappingRepository{
		DB:           db,
		QueryBuilder: trainerTrainingMappingRepositoryQueryBuilder,
	}
	studentsRltsRepository := &rlts.StudentsRltsRepository{
		UserRepository:                   userRepository,
		AttendancesRepository:            attendancesRepository,
		RegistrationsRepository:          registrationsRepository,
		TrainerTrainingMappingRepository: trainerTrainingMappingRepository,
	}
	trainersRepositoryQueryBuilder := &repo.TrainersRepositoryQueryBuilder{}
	trainersRepository := &repo.TrainersRepository{
		DB:           db,
		QueryBuilder: trainersRepositoryQueryBuilder,
	}
	trainerTrainingMappingRltsRepository := &rlts.TrainerTrainingMappingRltsRepository{
		TrainingEventRepository: trainingEventRepository,
		TrainersRepository:      trainersRepository,
		StudentsRepository:      studentsRepository,
	}
	trainersRltsRepository := &rlts.TrainersRltsRepository{
		UserRepository:                   userRepository,
		TrainerTrainingMappingRepository: trainerTrainingMappingRepository,
	}
	trainingRltsRepository := &rlts.TrainingRltsRepository{
		UserRepository:          userRepository,
		RegistrationsRepository: registrationsRepository,
		TrainingEventRepository: trainingEventRepository,
	}
	trainingEventRltsRepository := &rlts.TrainingEventRltsRepository{
		TrainingRepository:               trainingRepository,
		UserRepository:                   userRepository,
		AttendancesRepository:            attendancesRepository,
		TrainerTrainingMappingRepository: trainerTrainingMappingRepository,
	}
	userRltsRepository := &rlts.UserRltsRepository{
		StudentsRepository:      studentsRepository,
		TrainersRepository:      trainersRepository,
		TrainingRepository:      trainingRepository,
		TrainingEventRepository: trainingEventRepository,
	}
	xoResolver := xo_gen.XoResolver{
		IAttendancesRepository:                attendancesRepository,
		IAttendancesRltsRepository:            attendancesRltsRepository,
		IRegistrationsRepository:              registrationsRepository,
		IRegistrationsRltsRepository:          registrationsRltsRepository,
		IStudentsRepository:                   studentsRepository,
		IStudentsRltsRepository:               studentsRltsRepository,
		ITrainerTrainingMappingRepository:     trainerTrainingMappingRepository,
		ITrainerTrainingMappingRltsRepository: trainerTrainingMappingRltsRepository,
		ITrainersRepository:                   trainersRepository,
		ITrainersRltsRepository:               trainersRltsRepository,
		ITrainingRepository:                   trainingRepository,
		ITrainingRltsRepository:               trainingRltsRepository,
		ITrainingEventRepository:              trainingEventRepository,
		ITrainingEventRltsRepository:          trainingEventRltsRepository,
		IUserRepository:                       userRepository,
		IUserRltsRepository:                   userRltsRepository,
	}
	authService := &services.AuthService{
		UserRepository: userRepository,
	}
	resolver := &graphql.Resolver{
		XoResolver:   xoResolver,
		IAuthService: authService,
	}
	graphqlAuthenticateMiddleware := &middlewares.GraphqlAuthenticateMiddleware{
		IAuthService: authService,
	}
	headerMiddleware := &middlewares.HeaderMiddleware{}
	app := &App{
		Resolver:                      resolver,
		GraphqlAuthenticateMiddleware: graphqlAuthenticateMiddleware,
		HeaderMiddleware:              headerMiddleware,
	}
	return app, func() {
	}, nil
}

// wire.go:

type App struct {
	Resolver                      *graphql.Resolver
	GraphqlAuthenticateMiddleware *middlewares.GraphqlAuthenticateMiddleware
	HeaderMiddleware              *middlewares.HeaderMiddleware
}

var NewMiddlewareSet = wire.NewSet(middlewares.NewGraphqlAuthenticateMiddleware, middlewares.NewHeaderMiddleware)

var globalSet = wire.NewSet(xo_gen.NewRepositorySet, xo_gen.NewXoResolver, graphql.NewServiceSet, NewMiddlewareSet, wire.Struct(new(App), "*"), wire.Struct(new(graphql.Resolver), "*"), internal.NewDB)