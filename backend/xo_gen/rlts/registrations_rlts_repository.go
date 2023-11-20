// Code generated by xo. DO NOT EDIT.

package rlts

import (
	"context"

	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IRegistrationsRltsRepository interface {

	// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
	TrainingByFkTraining(ctx context.Context, obj *table.Registrations, filter *table.TrainingFilter) (*table.Training, error)
	InternalResourcesByFkInternalResource(ctx context.Context, obj *table.Registrations, filter *table.InternalResourcesFilter) (*table.InternalResources, error)

	//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record

}

type RegistrationsRltsRepository struct {
	TrainingRepository repo.ITrainingRepository

	InternalResourcesRepository repo.IInternalResourcesRepository
}

var NewRegistrationsRltsRepository = wire.NewSet(
	wire.Struct(new(RegistrationsRltsRepository), "*"),
	wire.Bind(new(IRegistrationsRltsRepository), new(*RegistrationsRltsRepository)),
)

func (rr *RegistrationsRltsRepository) TrainingByFkTraining(ctx context.Context, obj *table.Registrations, filter *table.TrainingFilter) (*table.Training, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.TrainingFilter{}
	}

	filter.AddID(internal.Eq, obj.FkTraining)
	result, err := rr.TrainingRepository.FindAllTraining(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
func (rr *RegistrationsRltsRepository) InternalResourcesByFkInternalResource(ctx context.Context, obj *table.Registrations, filter *table.InternalResourcesFilter) (*table.InternalResources, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.InternalResourcesFilter{}
	}

	filter.AddID(internal.Eq, obj.FkInternalResource)
	result, err := rr.InternalResourcesRepository.FindAllInternalResources(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
