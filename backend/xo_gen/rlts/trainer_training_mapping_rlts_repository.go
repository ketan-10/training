// Code generated by xo. DO NOT EDIT.

package rlts

import (
	"context"

	"github.com/google/wire"
	"github.com/ketan-10/classroom/backend/internal"
	"github.com/ketan-10/classroom/backend/xo_gen/repo"
	"github.com/ketan-10/classroom/backend/xo_gen/table"
)

type ITrainerTrainingMappingRltsRepository interface {

	// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
	TrainingEventByFkTrainingEvent(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.TrainingEventFilter) (*table.TrainingEvent, error)
	ExternalResourcesByFkExternalResource(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.ExternalResourcesFilter) (*table.ExternalResources, error)
	InternalResourcesByFkInternalResource(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.InternalResourcesFilter) (*table.InternalResources, error)

	//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record

}

type TrainerTrainingMappingRltsRepository struct {
	TrainingEventRepository repo.ITrainingEventRepository

	ExternalResourcesRepository repo.IExternalResourcesRepository

	InternalResourcesRepository repo.IInternalResourcesRepository
}

var NewTrainerTrainingMappingRltsRepository = wire.NewSet(
	wire.Struct(new(TrainerTrainingMappingRltsRepository), "*"),
	wire.Bind(new(ITrainerTrainingMappingRltsRepository), new(*TrainerTrainingMappingRltsRepository)),
)

func (ttmr *TrainerTrainingMappingRltsRepository) TrainingEventByFkTrainingEvent(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.TrainingEventFilter) (*table.TrainingEvent, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.TrainingEventFilter{}
	}

	filter.AddID(internal.Eq, obj.FkTrainingEvent)
	result, err := ttmr.TrainingEventRepository.FindAllTrainingEvent(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
func (ttmr *TrainerTrainingMappingRltsRepository) ExternalResourcesByFkExternalResource(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.ExternalResourcesFilter) (*table.ExternalResources, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.ExternalResourcesFilter{}
	}

	filter.AddID(internal.Eq, obj.FkExternalResource)
	result, err := ttmr.ExternalResourcesRepository.FindAllExternalResources(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
func (ttmr *TrainerTrainingMappingRltsRepository) InternalResourcesByFkInternalResource(ctx context.Context, obj *table.TrainerTrainingMapping, filter *table.InternalResourcesFilter) (*table.InternalResources, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.InternalResourcesFilter{}
	}

	filter.AddID(internal.Eq, obj.FkInternalResource)
	result, err := ttmr.InternalResourcesRepository.FindAllInternalResources(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}