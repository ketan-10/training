// Code generated by xo. DO NOT EDIT.

package rlts

import (
	"context"
	"database/sql"

	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/repo"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IUserRltsRepository interface {

	// This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record

	//  Other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record
	ExternalResourcesByCreatedBy(ctx context.Context, obj *table.User, filter *table.ExternalResourcesFilter, pagination *internal.Pagination) (*table.ListExternalResources, error)
	InternalResourcesByCreatedBy(ctx context.Context, obj *table.User, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)
	TrainingByRequestedBy(ctx context.Context, obj *table.User, filter *table.TrainingFilter, pagination *internal.Pagination) (*table.ListTraining, error)
	TrainingByCreatedBy(ctx context.Context, obj *table.User, filter *table.TrainingFilter, pagination *internal.Pagination) (*table.ListTraining, error)
	TrainingEventByCreatedBy(ctx context.Context, obj *table.User, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error)
}

type UserRltsRepository struct {
	ExternalResourcesRepository repo.IExternalResourcesRepository

	InternalResourcesRepository repo.IInternalResourcesRepository

	TrainingRepository repo.ITrainingRepository

	TrainingEventRepository repo.ITrainingEventRepository
}

var NewUserRltsRepository = wire.NewSet(
	wire.Struct(new(UserRltsRepository), "*"),
	wire.Bind(new(IUserRltsRepository), new(*UserRltsRepository)),
)

func (ur *UserRltsRepository) ExternalResourcesByCreatedBy(ctx context.Context, obj *table.User, filter *table.ExternalResourcesFilter, pagination *internal.Pagination) (*table.ListExternalResources, error) {
	if obj == nil {
		return &table.ListExternalResources{}, nil
	}
	return ur.ExternalResourcesRepository.ExternalResourcesByCreatedBy(ctx, sql.NullInt64{Valid: true, Int64: int64(obj.ID)}, filter, pagination)
}
func (ur *UserRltsRepository) InternalResourcesByCreatedBy(ctx context.Context, obj *table.User, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	if obj == nil {
		return &table.ListInternalResources{}, nil
	}
	return ur.InternalResourcesRepository.InternalResourcesByCreatedBy(ctx, sql.NullInt64{Valid: true, Int64: int64(obj.ID)}, filter, pagination)
}
func (ur *UserRltsRepository) TrainingByRequestedBy(ctx context.Context, obj *table.User, filter *table.TrainingFilter, pagination *internal.Pagination) (*table.ListTraining, error) {
	if obj == nil {
		return &table.ListTraining{}, nil
	}
	return ur.TrainingRepository.TrainingByRequestedBy(ctx, sql.NullInt64{Valid: true, Int64: int64(obj.ID)}, filter, pagination)
}
func (ur *UserRltsRepository) TrainingByCreatedBy(ctx context.Context, obj *table.User, filter *table.TrainingFilter, pagination *internal.Pagination) (*table.ListTraining, error) {
	if obj == nil {
		return &table.ListTraining{}, nil
	}
	return ur.TrainingRepository.TrainingByCreatedBy(ctx, sql.NullInt64{Valid: true, Int64: int64(obj.ID)}, filter, pagination)
}
func (ur *UserRltsRepository) TrainingEventByCreatedBy(ctx context.Context, obj *table.User, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error) {
	if obj == nil {
		return &table.ListTrainingEvent{}, nil
	}
	return ur.TrainingEventRepository.TrainingEventByCreatedBy(ctx, sql.NullInt64{Valid: true, Int64: int64(obj.ID)}, filter, pagination)
}
