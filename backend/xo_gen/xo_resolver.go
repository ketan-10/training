// Code generated by xo. DO NOT EDIT.

package xo_gen

import (
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/graphql/gen"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/rlts"
)

type XoResolver struct {
	repo.IAttendancesRepository
	rlts.IAttendancesRltsRepository
	repo.IRegistrationsRepository
	rlts.IRegistrationsRltsRepository
	repo.IStudentsRepository
	rlts.IStudentsRltsRepository
	repo.ITrainerTrainingMappingRepository
	rlts.ITrainerTrainingMappingRltsRepository
	repo.ITrainersRepository
	rlts.ITrainersRltsRepository
	repo.ITrainingRepository
	rlts.ITrainingRltsRepository
	repo.ITrainingEventRepository
	rlts.ITrainingEventRltsRepository
	repo.IUserRepository
	rlts.IUserRltsRepository
}

//type IXoResolver interface {
//    Attendances() gen.AttendancesResolver
//    Registrations() gen.RegistrationsResolver
//    Students() gen.StudentsResolver
//    TrainerTrainingMapping() gen.TrainerTrainingMappingResolver
//    Trainers() gen.TrainersResolver
//    Training() gen.TrainingResolver
//    TrainingEvent() gen.TrainingEventResolver
//    User() gen.UserResolver
//}

var NewXoResolver = wire.NewSet(
	wire.Struct(new(XoResolver), "*"),

// wire.Bind(new(IXoResolver), new(XoResolver)),
)

func (r *XoResolver) Attendances() gen.AttendancesResolver {
	return r.IAttendancesRltsRepository
}
func (r *XoResolver) Registrations() gen.RegistrationsResolver {
	return r.IRegistrationsRltsRepository
}
func (r *XoResolver) Students() gen.StudentsResolver {
	return r.IStudentsRltsRepository
}
func (r *XoResolver) TrainerTrainingMapping() gen.TrainerTrainingMappingResolver {
	return r.ITrainerTrainingMappingRltsRepository
}
func (r *XoResolver) Trainers() gen.TrainersResolver {
	return r.ITrainersRltsRepository
}
func (r *XoResolver) Training() gen.TrainingResolver {
	return r.ITrainingRltsRepository
}
func (r *XoResolver) TrainingEvent() gen.TrainingEventResolver {
	return r.ITrainingEventRltsRepository
}
func (r *XoResolver) User() gen.UserResolver {
	return r.IUserRltsRepository
}
