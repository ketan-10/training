// Code generated by xo. DO NOT EDIT.

package rlts

import (
	"context"

	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IInternalResourcesRltsRepository interface {

	// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
	UserByCreatedBy(ctx context.Context, obj *table.InternalResources, filter *table.UserFilter) (*table.User, error)

	//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record
	AttendancesByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.AttendancesFilter, pagination *internal.Pagination) (*table.ListAttendances, error)
	RegistrationsByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error)
	TrainerTrainingMappingByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.TrainerTrainingMappingFilter, pagination *internal.Pagination) (*table.ListTrainerTrainingMapping, error)
}

type InternalResourcesRltsRepository struct {
	UserRepository repo.IUserRepository

	AttendancesRepository repo.IAttendancesRepository

	RegistrationsRepository repo.IRegistrationsRepository

	TrainerTrainingMappingRepository repo.ITrainerTrainingMappingRepository
}

var NewInternalResourcesRltsRepository = wire.NewSet(
	wire.Struct(new(InternalResourcesRltsRepository), "*"),
	wire.Bind(new(IInternalResourcesRltsRepository), new(*InternalResourcesRltsRepository)),
)

func (irr *InternalResourcesRltsRepository) UserByCreatedBy(ctx context.Context, obj *table.InternalResources, filter *table.UserFilter) (*table.User, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.UserFilter{}
	}

	filter.AddID(internal.Eq, obj.CreatedBy)
	result, err := irr.UserRepository.FindAllUser(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
func (irr *InternalResourcesRltsRepository) AttendancesByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.AttendancesFilter, pagination *internal.Pagination) (*table.ListAttendances, error) {
	if obj == nil {
		return &table.ListAttendances{}, nil
	}
	return irr.AttendancesRepository.AttendancesByFkInternalResource(ctx, obj.ID, filter, pagination)
}
func (irr *InternalResourcesRltsRepository) RegistrationsByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error) {
	if obj == nil {
		return &table.ListRegistrations{}, nil
	}
	return irr.RegistrationsRepository.RegistrationsByFkInternalResource(ctx, obj.ID, filter, pagination)
}
func (irr *InternalResourcesRltsRepository) TrainerTrainingMappingByFkInternalResource(ctx context.Context, obj *table.InternalResources, filter *table.TrainerTrainingMappingFilter, pagination *internal.Pagination) (*table.ListTrainerTrainingMapping, error) {
	if obj == nil {
		return &table.ListTrainerTrainingMapping{}, nil
	}
	return irr.TrainerTrainingMappingRepository.TrainerTrainingMappingByFkInternalResource(ctx, obj.ID, filter, pagination)
}
