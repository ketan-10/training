// Code generated by xo. DO NOT EDIT.

package repo

import (
	"context"

	sq "github.com/elgris/sqrl"
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IRegistrationsRepository interface {
	IRegistrationsRepositoryQueryBuilder

	InsertRegistrations(ctx context.Context, r table.RegistrationsCreate) (*table.Registrations, error)
	InsertRegistrationsWithSuffix(ctx context.Context, r table.RegistrationsCreate, suffix sq.Sqlizer) (*table.Registrations, error)
	InsertRegistrationsIDResult(ctx context.Context, r table.RegistrationsCreate, suffix sq.Sqlizer) (int64, error)

	UpdateRegistrationsByFields(ctx context.Context, id int, r table.RegistrationsUpdate) (*table.Registrations, error)
	UpdateRegistrations(ctx context.Context, r table.Registrations) (*table.Registrations, error)

	DeleteRegistrations(ctx context.Context, r table.Registrations) error
	DeleteRegistrationsByID(ctx context.Context, id int) (bool, error)

	FindAllRegistrations(ctx context.Context, r *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error)
	FindAllRegistrationsWithSuffix(ctx context.Context, r *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error)

	RegistrationsByFkStudent(ctx context.Context, fkStudent int, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error)

	RegistrationsByFkStudentWithSuffix(ctx context.Context, fkStudent int, filter *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error)

	RegistrationsByFkTraining(ctx context.Context, fkTraining int, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error)

	RegistrationsByFkTrainingWithSuffix(ctx context.Context, fkTraining int, filter *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error)
	RegistrationsByID(ctx context.Context, id int, filter *table.RegistrationsFilter) (table.Registrations, error)

	RegistrationsByIDWithSuffix(ctx context.Context, id int, filter *table.RegistrationsFilter, suffixes ...sq.Sqlizer) (table.Registrations, error)
}

type IRegistrationsRepositoryQueryBuilder interface {
	FindAllRegistrationsBaseQuery(ctx context.Context, filter *table.RegistrationsFilter, fields string, suffix ...sq.Sqlizer) (*sq.SelectBuilder, error)
	AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error)
}

type RegistrationsRepository struct {
	DB           internal.IDb
	QueryBuilder IRegistrationsRepositoryQueryBuilder
}

type RegistrationsRepositoryQueryBuilder struct {
}

var NewRegistrationsRepository = wire.NewSet(
	wire.Struct(new(RegistrationsRepository), "*"),
	wire.Struct(new(RegistrationsRepositoryQueryBuilder), "*"),
	wire.Bind(new(IRegistrationsRepository), new(*RegistrationsRepository)),
	wire.Bind(new(IRegistrationsRepositoryQueryBuilder), new(*RegistrationsRepositoryQueryBuilder)),
)

func (rr *RegistrationsRepository) InsertRegistrations(ctx context.Context, r table.RegistrationsCreate) (*table.Registrations, error) {
	return rr.InsertRegistrationsWithSuffix(ctx, r, nil)
}

func (rr *RegistrationsRepository) InsertRegistrationsWithSuffix(ctx context.Context, r table.RegistrationsCreate, suffix sq.Sqlizer) (*table.Registrations, error) {
	var err error

	id, err := rr.InsertRegistrationsIDResult(ctx, r, suffix)
	if err != nil {
		return nil, err
	}
	newr := table.Registrations{}
	qb := sq.Select("*").From(`registrations`)

	qb.Where(sq.Eq{"`id`": id})
	err = rr.DB.Get(ctx, &newr, qb)

	if err != nil {
		return nil, err
	}
	return &newr, nil
}

func (rr *RegistrationsRepository) InsertRegistrationsIDResult(ctx context.Context, r table.RegistrationsCreate, suffix sq.Sqlizer) (int64, error) {
	var err error

	qb := sq.Insert("`registrations`").Columns(
		"`fk_student`",
		"`fk_training`",
	).Values(
		r.FkStudent,
		r.FkTraining,
	)
	if suffix != nil {
		suffixQuery, suffixArgs, suffixErr := suffix.ToSql()
		if suffixErr != nil {
			return 0, suffixErr
		}
		qb.Suffix(suffixQuery, suffixArgs...)
	}

	// run query
	res, err := rr.DB.Exec(ctx, qb)
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

func (rr *RegistrationsRepository) UpdateRegistrationsByFields(ctx context.Context, id int, r table.RegistrationsUpdate) (*table.Registrations, error) {
	var err error

	updateMap := map[string]interface{}{}
	if r.FkStudent != nil {
		updateMap["`fk_student`"] = *r.FkStudent
	}
	if r.FkTraining != nil {
		updateMap["`fk_training`"] = *r.FkTraining
	}
	if r.Active != nil {
		updateMap["`active`"] = *r.Active
	}

	qb := sq.Update(`registrations`).SetMap(updateMap).Where(sq.Eq{"`id`": id})

	_, err = rr.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`registrations`")

	selectQb = selectQb.Where(sq.Eq{"`id`": id})

	result := table.Registrations{}
	err = rr.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (rr *RegistrationsRepository) UpdateRegistrations(ctx context.Context, r table.Registrations) (*table.Registrations, error) {
	var err error

	// sql query
	qb := sq.Update("`registrations`").SetMap(map[string]interface{}{
		"`fk_student`":  r.FkStudent,
		"`fk_training`": r.FkTraining,
		"`active`":      r.Active,
	}).Where(sq.Eq{"`id`": r.ID})

	// run query
	_, err = rr.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`registrations`")
	selectQb = selectQb.Where(sq.Eq{"`id`": r.ID})

	result := table.Registrations{}
	err = rr.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (rr *RegistrationsRepository) DeleteRegistrations(ctx context.Context, r table.Registrations) error {
	_, err := rr.DeleteRegistrationsByID(ctx, r.ID)
	return err
}

func (rr *RegistrationsRepository) DeleteRegistrationsByID(ctx context.Context, id int) (bool, error) {
	var err error

	qb := sq.Update("`registrations`").Set("active", false)

	qb = qb.Where(sq.Eq{"`id`": id})

	_, err = rr.DB.Exec(ctx, qb)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (rr *RegistrationsRepository) FindAllRegistrationsBaseQuery(ctx context.Context, filter *table.RegistrationsFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	return rr.QueryBuilder.FindAllRegistrationsBaseQuery(ctx, filter, fields, suffixes...)
}

func (rr *RegistrationsRepositoryQueryBuilder) FindAllRegistrationsBaseQuery(ctx context.Context, filter *table.RegistrationsFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	var err error
	qb := sq.Select(fields).From("`registrations`")
	if filter != nil {
		if qb, err = internal.AddFilter(qb, "`registrations`.`id`", filter.ID); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`registrations`.`fk_student`", filter.FkStudent); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`registrations`.`fk_training`", filter.FkTraining); err != nil {
			return qb, err
		}
		if filter.Active == nil {
			if qb, err = internal.AddFilter(qb, "`registrations`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
				return qb, err
			}
		} else {
			if qb, err = internal.AddFilter(qb, "`registrations`.`active`", filter.Active); err != nil {
				return qb, err
			}
		}
		if qb, err = internal.AddFilter(qb, "`registrations`.`created_at`", filter.CreatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`registrations`.`updated_at`", filter.UpdatedAt); err != nil {
			return qb, err
		}
		qb, err = internal.AddAdditionalFilter(qb, filter.Wheres, filter.Joins, filter.LeftJoins, filter.GroupBys, filter.Havings)
		if err != nil {
			return qb, err
		}
	} else {
		if qb, err = internal.AddFilter(qb, "`registrations`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
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

func (rr *RegistrationsRepository) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	return rr.QueryBuilder.AddPagination(ctx, qb, pagination)
}

func (r *RegistrationsRepositoryQueryBuilder) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	fields := []string{
		"id",
		"fk_student",
		"fk_training",
		"active",
		"created_at",
		"updated_at",
	}
	return internal.AddPagination(qb, pagination, "registrations", fields)
}

func (rr *RegistrationsRepository) FindAllRegistrations(ctx context.Context, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error) {
	return rr.FindAllRegistrationsWithSuffix(ctx, filter, pagination)
}

func (rr *RegistrationsRepository) FindAllRegistrationsWithSuffix(ctx context.Context, filter *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error) {
	var list table.ListRegistrations
	qb, err := rr.FindAllRegistrationsBaseQuery(ctx, filter, "`registrations`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb, err = rr.AddPagination(ctx, qb, pagination)
	if err != nil {
		return &list, err
	}

	err = rr.DB.Select(ctx, &list.Data, qb)

	if err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = rr.FindAllRegistrationsBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &table.ListRegistrations{}, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	err = rr.DB.Get(ctx, &listMeta, qb)

	list.TotalCount = listMeta.Count

	return &list, err
}

func (rr *RegistrationsRepository) RegistrationsByFkStudent(ctx context.Context, fkStudent int, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error) {
	return rr.RegistrationsByFkStudentWithSuffix(ctx, fkStudent, filter, pagination)
}

func (rr *RegistrationsRepository) RegistrationsByFkStudentWithSuffix(ctx context.Context, fkStudent int, filter *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error) {

	var list table.ListRegistrations
	// sql query
	qb, err := rr.FindAllRegistrationsBaseQuery(ctx, filter, "`registrations`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`registrations`.`fk_student`": fkStudent})

	if qb, err = rr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = rr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = rr.FindAllRegistrationsBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`registrations`.`fk_student`": fkStudent})
	if err = rr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}

func (rr *RegistrationsRepository) RegistrationsByFkTraining(ctx context.Context, fkTraining int, filter *table.RegistrationsFilter, pagination *internal.Pagination) (*table.ListRegistrations, error) {
	return rr.RegistrationsByFkTrainingWithSuffix(ctx, fkTraining, filter, pagination)
}

func (rr *RegistrationsRepository) RegistrationsByFkTrainingWithSuffix(ctx context.Context, fkTraining int, filter *table.RegistrationsFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListRegistrations, error) {

	var list table.ListRegistrations
	// sql query
	qb, err := rr.FindAllRegistrationsBaseQuery(ctx, filter, "`registrations`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`registrations`.`fk_training`": fkTraining})

	if qb, err = rr.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = rr.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = rr.FindAllRegistrationsBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`registrations`.`fk_training`": fkTraining})
	if err = rr.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}
func (rr *RegistrationsRepository) RegistrationsByID(ctx context.Context, id int, filter *table.RegistrationsFilter) (table.Registrations, error) {
	return rr.RegistrationsByIDWithSuffix(ctx, id, filter)
}

func (rr *RegistrationsRepository) RegistrationsByIDWithSuffix(ctx context.Context, id int, filter *table.RegistrationsFilter, suffixes ...sq.Sqlizer) (table.Registrations, error) {
	var err error

	// sql query
	qb, err := rr.FindAllRegistrationsBaseQuery(ctx, filter, "`registrations`.*", suffixes...)
	if err != nil {
		return table.Registrations{}, err
	}
	qb = qb.Where(sq.Eq{"`registrations`.`id`": id})

	// run query
	r := table.Registrations{}
	err = rr.DB.Get(ctx, &r, qb)
	if err != nil {
		return table.Registrations{}, err
	}
	return r, nil
}
