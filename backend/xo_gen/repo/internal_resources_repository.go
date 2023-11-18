// Code generated by xo. DO NOT EDIT.

package repo

import (
	"context"
	"database/sql"

	sq "github.com/elgris/sqrl"
	"github.com/google/wire"
	"github.com/ketan-10/classroom/backend/internal"
	"github.com/ketan-10/classroom/backend/xo_gen/table"
)

type IInternalResourcesRepository interface {
	IInternalResourcesRepositoryQueryBuilder

	InsertInternalResources(ctx context.Context, ir table.InternalResourcesCreate) (*table.InternalResources, error)
	InsertInternalResourcesWithSuffix(ctx context.Context, ir table.InternalResourcesCreate, suffix sq.Sqlizer) (*table.InternalResources, error)
	InsertInternalResourcesIDResult(ctx context.Context, ir table.InternalResourcesCreate, suffix sq.Sqlizer) (int64, error)

	UpdateInternalResourcesByFields(ctx context.Context, id int, ir table.InternalResourcesUpdate) (*table.InternalResources, error)
	UpdateInternalResources(ctx context.Context, ir table.InternalResources) (*table.InternalResources, error)

	DeleteInternalResources(ctx context.Context, ir table.InternalResources) error
	DeleteInternalResourcesByID(ctx context.Context, id int) (bool, error)

	FindAllInternalResources(ctx context.Context, ir *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)
	FindAllInternalResourcesWithSuffix(ctx context.Context, ir *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error)

	InternalResourcesByCreatedBy(ctx context.Context, createdBy sql.NullInt64, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)

	InternalResourcesByCreatedByWithSuffix(ctx context.Context, createdBy sql.NullInt64, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error)

	InternalResourcesByEmail(ctx context.Context, email string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)

	InternalResourcesByEmailWithSuffix(ctx context.Context, email string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error)

	InternalResourcesByResourceID(ctx context.Context, resourceID string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)

	InternalResourcesByResourceIDWithSuffix(ctx context.Context, resourceID string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error)
	InternalResourcesByResourceIDActive(ctx context.Context, resourceID string, active bool, filter *table.InternalResourcesFilter) (table.InternalResources, error)

	InternalResourcesByResourceIDActiveWithSuffix(ctx context.Context, resourceID string, active bool, filter *table.InternalResourcesFilter, suffixes ...sq.Sqlizer) (table.InternalResources, error)

	InternalResourcesByName(ctx context.Context, name string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error)

	InternalResourcesByNameWithSuffix(ctx context.Context, name string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error)
	InternalResourcesByID(ctx context.Context, id int, filter *table.InternalResourcesFilter) (table.InternalResources, error)

	InternalResourcesByIDWithSuffix(ctx context.Context, id int, filter *table.InternalResourcesFilter, suffixes ...sq.Sqlizer) (table.InternalResources, error)
}

type IInternalResourcesRepositoryQueryBuilder interface {
	FindAllInternalResourcesBaseQuery(ctx context.Context, filter *table.InternalResourcesFilter, fields string, suffix ...sq.Sqlizer) (*sq.SelectBuilder, error)
	AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error)
}

type InternalResourcesRepository struct {
	DB           internal.IDb
	QueryBuilder IInternalResourcesRepositoryQueryBuilder
}

type InternalResourcesRepositoryQueryBuilder struct {
}

var NewInternalResourcesRepository = wire.NewSet(
	wire.Struct(new(InternalResourcesRepository), "*"),
	wire.Struct(new(InternalResourcesRepositoryQueryBuilder), "*"),
	wire.Bind(new(IInternalResourcesRepository), new(*InternalResourcesRepository)),
	wire.Bind(new(IInternalResourcesRepositoryQueryBuilder), new(*InternalResourcesRepositoryQueryBuilder)),
)

func (irr *InternalResourcesRepository) InsertInternalResources(ctx context.Context, ir table.InternalResourcesCreate) (*table.InternalResources, error) {
	return irr.InsertInternalResourcesWithSuffix(ctx, ir, nil)
}

func (irr *InternalResourcesRepository) InsertInternalResourcesWithSuffix(ctx context.Context, ir table.InternalResourcesCreate, suffix sq.Sqlizer) (*table.InternalResources, error) {
	var err error

	id, err := irr.InsertInternalResourcesIDResult(ctx, ir, suffix)
	if err != nil {
		return nil, err
	}
	newir := table.InternalResources{}
	qb := sq.Select("*").From(`internal_resources`)

	qb.Where(sq.Eq{"`id`": id})
	err = irr.DB.Get(ctx, &newir, qb)

	if err != nil {
		return nil, err
	}
	return &newir, nil
}

func (irr *InternalResourcesRepository) InsertInternalResourcesIDResult(ctx context.Context, ir table.InternalResourcesCreate, suffix sq.Sqlizer) (int64, error) {
	var err error

	qb := sq.Insert("`internal_resources`").Columns(
		"`resource_id`",
		"`name`",
		"`email`",
		"`mobile_phone`",
		"`project_name`",
		"`designation`",
		"`created_by`",
	).Values(
		ir.ResourceID,
		ir.Name,
		ir.Email,
		ir.MobilePhone,
		ir.ProjectName,
		ir.Designation,
		ir.CreatedBy,
	)
	if suffix != nil {
		suffixQuery, suffixArgs, suffixErr := suffix.ToSql()
		if suffixErr != nil {
			return 0, suffixErr
		}
		qb.Suffix(suffixQuery, suffixArgs...)
	}

	// run query
	res, err := irr.DB.Exec(ctx, qb)
	if err != nil {
		return 0, err
	}

	// retrieve id
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (irr *InternalResourcesRepository) UpdateInternalResourcesByFields(ctx context.Context, id int, ir table.InternalResourcesUpdate) (*table.InternalResources, error) {
	var err error

	updateMap := map[string]interface{}{}
	if ir.ResourceID != nil {
		updateMap["`resource_id`"] = *ir.ResourceID
	}
	if ir.Name != nil {
		updateMap["`name`"] = *ir.Name
	}
	if ir.Email != nil {
		updateMap["`email`"] = *ir.Email
	}
	if ir.MobilePhone != nil {
		updateMap["`mobile_phone`"] = *ir.MobilePhone
	}
	if ir.ProjectName != nil {
		updateMap["`project_name`"] = *ir.ProjectName
	}
	if ir.Designation != nil {
		updateMap["`designation`"] = *ir.Designation
	}
	if ir.Active != nil {
		updateMap["`active`"] = *ir.Active
	}
	if ir.CreatedBy != nil {
		updateMap["`created_by`"] = *ir.CreatedBy
	}

	qb := sq.Update(`internal_resources`).SetMap(updateMap).Where(sq.Eq{"`id`": id})

	_, err = irr.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`internal_resources`")

	selectQb = selectQb.Where(sq.Eq{"`id`": id})

	result := table.InternalResources{}
	err = irr.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (irr *InternalResourcesRepository) UpdateInternalResources(ctx context.Context, ir table.InternalResources) (*table.InternalResources, error) {
	var err error

	// sql query
	qb := sq.Update("`internal_resources`").SetMap(map[string]interface{}{
		"`resource_id`":  ir.ResourceID,
		"`name`":         ir.Name,
		"`email`":        ir.Email,
		"`mobile_phone`": ir.MobilePhone,
		"`project_name`": ir.ProjectName,
		"`designation`":  ir.Designation,
		"`active`":       ir.Active,
		"`created_by`":   ir.CreatedBy,
	}).Where(sq.Eq{"`id`": ir.ID})

	// run query
	_, err = irr.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`internal_resources`")
	selectQb = selectQb.Where(sq.Eq{"`id`": ir.ID})

	result := table.InternalResources{}
	err = irr.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (irr *InternalResourcesRepository) DeleteInternalResources(ctx context.Context, ir table.InternalResources) error {
	_, err := irr.DeleteInternalResourcesByID(ctx, ir.ID)
	return err
}

func (irr *InternalResourcesRepository) DeleteInternalResourcesByID(ctx context.Context, id int) (bool, error) {
	var err error

	qb := sq.Update("`internal_resources`").Set("active", false)

	qb = qb.Where(sq.Eq{"`id`": id})

	_, err = irr.DB.Exec(ctx, qb)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (irr *InternalResourcesRepository) FindAllInternalResourcesBaseQuery(ctx context.Context, filter *table.InternalResourcesFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	return irr.QueryBuilder.FindAllInternalResourcesBaseQuery(ctx, filter, fields, suffixes...)
}

func (irr *InternalResourcesRepositoryQueryBuilder) FindAllInternalResourcesBaseQuery(ctx context.Context, filter *table.InternalResourcesFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	var err error
	qb := sq.Select(fields).From("`internal_resources`")
	if filter != nil {
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`id`", filter.ID); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`resource_id`", filter.ResourceID); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`name`", filter.Name); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`email`", filter.Email); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`mobile_phone`", filter.MobilePhone); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`project_name`", filter.ProjectName); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`designation`", filter.Designation); err != nil {
			return qb, err
		}
		if filter.Active == nil {
			if qb, err = internal.AddFilter(qb, "`internal_resources`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
				return qb, err
			}
		} else {
			if qb, err = internal.AddFilter(qb, "`internal_resources`.`active`", filter.Active); err != nil {
				return qb, err
			}
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`created_at`", filter.CreatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`updated_at`", filter.UpdatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`created_by`", filter.CreatedBy); err != nil {
			return qb, err
		}
		qb, err = internal.AddAdditionalFilter(qb, filter.Wheres, filter.Joins, filter.LeftJoins, filter.GroupBys, filter.Havings)
		if err != nil {
			return qb, err
		}
	} else {
		if qb, err = internal.AddFilter(qb, "`internal_resources`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
			return qb, err
		}
	}

	for _, suffix := range suffixes {
		query, args, err := suffix.ToSql()
		if err != nil {
			return qb, err
		}
		qb.Suffix(query, args...)
	}
	return qb, nil
}

func (irr *InternalResourcesRepository) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	return irr.QueryBuilder.AddPagination(ctx, qb, pagination)
}

func (ir *InternalResourcesRepositoryQueryBuilder) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	fields := []string{
		"id",
		"resource_id",
		"name",
		"email",
		"mobile_phone",
		"project_name",
		"designation",
		"active",
		"created_at",
		"updated_at",
		"created_by",
	}
	return internal.AddPagination(qb, pagination, "internal_resources", fields)
}

func (irr *InternalResourcesRepository) FindAllInternalResources(ctx context.Context, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	return irr.FindAllInternalResourcesWithSuffix(ctx, filter, pagination)
}

func (irr *InternalResourcesRepository) FindAllInternalResourcesWithSuffix(ctx context.Context, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error) {
	var list table.ListInternalResources
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb, err = irr.AddPagination(ctx, qb, pagination)
	if err != nil {
		return &list, err
	}

	err = irr.DB.Select(ctx, &list.Data, qb)

	if err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = irr.FindAllInternalResourcesBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &table.ListInternalResources{}, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	err = irr.DB.Get(ctx, &listMeta, qb)

	list.TotalCount = listMeta.Count

	return &list, err
}

func (irr *InternalResourcesRepository) InternalResourcesByCreatedBy(ctx context.Context, createdBy sql.NullInt64, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	return irr.InternalResourcesByCreatedByWithSuffix(ctx, createdBy, filter, pagination)
}

func (irr *InternalResourcesRepository) InternalResourcesByCreatedByWithSuffix(ctx context.Context, createdBy sql.NullInt64, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error) {

	var list table.ListInternalResources
	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`created_by`": createdBy})

	if qb, err = irr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = irr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = irr.FindAllInternalResourcesBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`created_by`": createdBy})
	if err = irr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}

func (irr *InternalResourcesRepository) InternalResourcesByEmail(ctx context.Context, email string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	return irr.InternalResourcesByEmailWithSuffix(ctx, email, filter, pagination)
}

func (irr *InternalResourcesRepository) InternalResourcesByEmailWithSuffix(ctx context.Context, email string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error) {

	var list table.ListInternalResources
	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`email`": email})

	if qb, err = irr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = irr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = irr.FindAllInternalResourcesBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`email`": email})
	if err = irr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}

func (irr *InternalResourcesRepository) InternalResourcesByResourceID(ctx context.Context, resourceID string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	return irr.InternalResourcesByResourceIDWithSuffix(ctx, resourceID, filter, pagination)
}

func (irr *InternalResourcesRepository) InternalResourcesByResourceIDWithSuffix(ctx context.Context, resourceID string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error) {

	var list table.ListInternalResources
	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`resource_id`": resourceID})

	if qb, err = irr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = irr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = irr.FindAllInternalResourcesBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`resource_id`": resourceID})
	if err = irr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}
func (irr *InternalResourcesRepository) InternalResourcesByResourceIDActive(ctx context.Context, resourceID string, active bool, filter *table.InternalResourcesFilter) (table.InternalResources, error) {
	return irr.InternalResourcesByResourceIDActiveWithSuffix(ctx, resourceID, active, filter)
}

func (irr *InternalResourcesRepository) InternalResourcesByResourceIDActiveWithSuffix(ctx context.Context, resourceID string, active bool, filter *table.InternalResourcesFilter, suffixes ...sq.Sqlizer) (table.InternalResources, error) {
	var err error

	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return table.InternalResources{}, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`resource_id`": resourceID})
	qb = qb.Where(sq.Eq{"`internal_resources`.`active`": active})

	// run query
	ir := table.InternalResources{}
	err = irr.DB.Get(ctx, &ir, qb)
	if err != nil {
		return table.InternalResources{}, err
	}
	return ir, nil
}

func (irr *InternalResourcesRepository) InternalResourcesByName(ctx context.Context, name string, filter *table.InternalResourcesFilter, pagination *internal.Pagination) (*table.ListInternalResources, error) {
	return irr.InternalResourcesByNameWithSuffix(ctx, name, filter, pagination)
}

func (irr *InternalResourcesRepository) InternalResourcesByNameWithSuffix(ctx context.Context, name string, filter *table.InternalResourcesFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListInternalResources, error) {

	var list table.ListInternalResources
	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`name`": name})

	if qb, err = irr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = irr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = irr.FindAllInternalResourcesBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`name`": name})
	if err = irr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}
func (irr *InternalResourcesRepository) InternalResourcesByID(ctx context.Context, id int, filter *table.InternalResourcesFilter) (table.InternalResources, error) {
	return irr.InternalResourcesByIDWithSuffix(ctx, id, filter)
}

func (irr *InternalResourcesRepository) InternalResourcesByIDWithSuffix(ctx context.Context, id int, filter *table.InternalResourcesFilter, suffixes ...sq.Sqlizer) (table.InternalResources, error) {
	var err error

	// sql query
	qb, err := irr.FindAllInternalResourcesBaseQuery(ctx, filter, "`internal_resources`.*", suffixes...)
	if err != nil {
		return table.InternalResources{}, err
	}
	qb = qb.Where(sq.Eq{"`internal_resources`.`id`": id})

	// run query
	ir := table.InternalResources{}
	err = irr.DB.Get(ctx, &ir, qb)
	if err != nil {
		return table.InternalResources{}, err
	}
	return ir, nil
}