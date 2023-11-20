// Code generated by xo. DO NOT EDIT.

package rlts

import (
	"context"

	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IAttendancesRltsRepository interface {

	// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
	TrainingEventByFkTrainingEvent(ctx context.Context, obj *table.Attendances, filter *table.TrainingEventFilter) (*table.TrainingEvent, error)
	InternalResourcesByFkInternalResource(ctx context.Context, obj *table.Attendances, filter *table.InternalResourcesFilter) (*table.InternalResources, error)

	//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record

}

type AttendancesRltsRepository struct {
	TrainingEventRepository repo.ITrainingEventRepository

	InternalResourcesRepository repo.IInternalResourcesRepository
}

var NewAttendancesRltsRepository = wire.NewSet(
	wire.Struct(new(AttendancesRltsRepository), "*"),
	wire.Bind(new(IAttendancesRltsRepository), new(*AttendancesRltsRepository)),
)

func (ar *AttendancesRltsRepository) TrainingEventByFkTrainingEvent(ctx context.Context, obj *table.Attendances, filter *table.TrainingEventFilter) (*table.TrainingEvent, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.TrainingEventFilter{}
	}

	filter.AddID(internal.Eq, obj.FkTrainingEvent)
	result, err := ar.TrainingEventRepository.FindAllTrainingEvent(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
func (ar *AttendancesRltsRepository) InternalResourcesByFkInternalResource(ctx context.Context, obj *table.Attendances, filter *table.InternalResourcesFilter) (*table.InternalResources, error) {
	if obj == nil {
		return nil, nil
	}

	if filter == nil {
		filter = &table.InternalResourcesFilter{}
	}

	filter.AddID(internal.Eq, obj.FkInternalResource)
	result, err := ar.InternalResourcesRepository.FindAllInternalResources(ctx, filter, nil)

	if err != nil {
		return nil, err
	}

	if result.TotalCount == 0 {
		return nil, nil
	}
	return &result.Data[0], nil
}
