// Code generated by xo. DO NOT EDIT.

package repo

import (
	"context"
	"database/sql"

	sq "github.com/elgris/sqrl"
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type ITrainingEventRepository interface {
	ITrainingEventRepositoryQueryBuilder

	InsertTrainingEvent(ctx context.Context, te table.TrainingEventCreate) (*table.TrainingEvent, error)
	InsertTrainingEventWithSuffix(ctx context.Context, te table.TrainingEventCreate, suffix sq.Sqlizer) (*table.TrainingEvent, error)
	InsertTrainingEventIDResult(ctx context.Context, te table.TrainingEventCreate, suffix sq.Sqlizer) (int64, error)

	UpdateTrainingEventByFields(ctx context.Context, id int, te table.TrainingEventUpdate) (*table.TrainingEvent, error)
	UpdateTrainingEvent(ctx context.Context, te table.TrainingEvent) (*table.TrainingEvent, error)

	DeleteTrainingEvent(ctx context.Context, te table.TrainingEvent) error
	DeleteTrainingEventByID(ctx context.Context, id int) (bool, error)

	FindAllTrainingEvent(ctx context.Context, te *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error)
	FindAllTrainingEventWithSuffix(ctx context.Context, te *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error)
	TrainingEventByID(ctx context.Context, id int, filter *table.TrainingEventFilter) (table.TrainingEvent, error)

	TrainingEventByIDWithSuffix(ctx context.Context, id int, filter *table.TrainingEventFilter, suffixes ...sq.Sqlizer) (table.TrainingEvent, error)

	TrainingEventByCreatedBy(ctx context.Context, createdBy sql.NullInt64, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error)

	TrainingEventByCreatedByWithSuffix(ctx context.Context, createdBy sql.NullInt64, filter *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error)

	TrainingEventByFkTraining(ctx context.Context, fkTraining int, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error)

	TrainingEventByFkTrainingWithSuffix(ctx context.Context, fkTraining int, filter *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error)
}

type ITrainingEventRepositoryQueryBuilder interface {
	FindAllTrainingEventBaseQuery(ctx context.Context, filter *table.TrainingEventFilter, fields string, suffix ...sq.Sqlizer) (*sq.SelectBuilder, error)
	AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error)
}

type TrainingEventRepository struct {
	DB           internal.IDb
	QueryBuilder ITrainingEventRepositoryQueryBuilder
}

type TrainingEventRepositoryQueryBuilder struct {
}

var NewTrainingEventRepository = wire.NewSet(
	wire.Struct(new(TrainingEventRepository), "*"),
	wire.Struct(new(TrainingEventRepositoryQueryBuilder), "*"),
	wire.Bind(new(ITrainingEventRepository), new(*TrainingEventRepository)),
	wire.Bind(new(ITrainingEventRepositoryQueryBuilder), new(*TrainingEventRepositoryQueryBuilder)),
)

func (ter *TrainingEventRepository) InsertTrainingEvent(ctx context.Context, te table.TrainingEventCreate) (*table.TrainingEvent, error) {
	return ter.InsertTrainingEventWithSuffix(ctx, te, nil)
}

func (ter *TrainingEventRepository) InsertTrainingEventWithSuffix(ctx context.Context, te table.TrainingEventCreate, suffix sq.Sqlizer) (*table.TrainingEvent, error) {
	var err error

	id, err := ter.InsertTrainingEventIDResult(ctx, te, suffix)
	if err != nil {
		return nil, err
	}
	newte := table.TrainingEvent{}
	qb := sq.Select("*").From(`training_event`)

	qb.Where(sq.Eq{"`id`": id})
	err = ter.DB.Get(ctx, &newte, qb)

	if err != nil {
		return nil, err
	}
	return &newte, nil
}

func (ter *TrainingEventRepository) InsertTrainingEventIDResult(ctx context.Context, te table.TrainingEventCreate, suffix sq.Sqlizer) (int64, error) {
	var err error

	qb := sq.Insert("`training_event`").Columns(
		"`fk_training`",
		"`status`",
		"`from`",
		"`completed_on`",
		"`duration`",
		"`created_by`",
	).Values(
		te.FkTraining,
		te.Status,
		te.From,
		te.CompletedOn,
		te.Duration,
		te.CreatedBy,
	)
	if suffix != nil {
		suffixQuery, suffixArgs, suffixErr := suffix.ToSql()
		if suffixErr != nil {
			return 0, suffixErr
		}
		qb.Suffix(suffixQuery, suffixArgs...)
	}

	// run query
	res, err := ter.DB.Exec(ctx, qb)
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

func (ter *TrainingEventRepository) UpdateTrainingEventByFields(ctx context.Context, id int, te table.TrainingEventUpdate) (*table.TrainingEvent, error) {
	var err error

	updateMap := map[string]interface{}{}
	if te.FkTraining != nil {
		updateMap["`fk_training`"] = *te.FkTraining
	}
	if te.Status != nil {
		updateMap["`status`"] = *te.Status
	}
	if te.From != nil {
		updateMap["`from`"] = *te.From
	}
	if te.CompletedOn != nil {
		updateMap["`completed_on`"] = *te.CompletedOn
	}
	if te.Duration != nil {
		updateMap["`duration`"] = *te.Duration
	}
	if te.Active != nil {
		updateMap["`active`"] = *te.Active
	}
	if te.CreatedBy != nil {
		updateMap["`created_by`"] = *te.CreatedBy
	}

	qb := sq.Update(`training_event`).SetMap(updateMap).Where(sq.Eq{"`id`": id})

	_, err = ter.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`training_event`")

	selectQb = selectQb.Where(sq.Eq{"`id`": id})

	result := table.TrainingEvent{}
	err = ter.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (ter *TrainingEventRepository) UpdateTrainingEvent(ctx context.Context, te table.TrainingEvent) (*table.TrainingEvent, error) {
	var err error

	// sql query
	qb := sq.Update("`training_event`").SetMap(map[string]interface{}{
		"`fk_training`":  te.FkTraining,
		"`status`":       te.Status,
		"`from`":         te.From,
		"`completed_on`": te.CompletedOn,
		"`duration`":     te.Duration,
		"`active`":       te.Active,
		"`created_by`":   te.CreatedBy,
	}).Where(sq.Eq{"`id`": te.ID})

	// run query
	_, err = ter.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`training_event`")
	selectQb = selectQb.Where(sq.Eq{"`id`": te.ID})

	result := table.TrainingEvent{}
	err = ter.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (ter *TrainingEventRepository) DeleteTrainingEvent(ctx context.Context, te table.TrainingEvent) error {
	_, err := ter.DeleteTrainingEventByID(ctx, te.ID)
	return err
}

func (ter *TrainingEventRepository) DeleteTrainingEventByID(ctx context.Context, id int) (bool, error) {
	var err error

	qb := sq.Update("`training_event`").Set("active", false)

	qb = qb.Where(sq.Eq{"`id`": id})

	_, err = ter.DB.Exec(ctx, qb)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (ter *TrainingEventRepository) FindAllTrainingEventBaseQuery(ctx context.Context, filter *table.TrainingEventFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	return ter.QueryBuilder.FindAllTrainingEventBaseQuery(ctx, filter, fields, suffixes...)
}

func (ter *TrainingEventRepositoryQueryBuilder) FindAllTrainingEventBaseQuery(ctx context.Context, filter *table.TrainingEventFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	var err error
	qb := sq.Select(fields).From("`training_event`")
	if filter != nil {
		if qb, err = internal.AddFilter(qb, "`training_event`.`id`", filter.ID); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`fk_training`", filter.FkTraining); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`status`", filter.Status); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`from`", filter.From); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`completed_on`", filter.CompletedOn); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`duration`", filter.Duration); err != nil {
			return qb, err
		}
		if filter.Active == nil {
			if qb, err = internal.AddFilter(qb, "`training_event`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
				return qb, err
			}
		} else {
			if qb, err = internal.AddFilter(qb, "`training_event`.`active`", filter.Active); err != nil {
				return qb, err
			}
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`created_at`", filter.CreatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`updated_at`", filter.UpdatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`training_event`.`created_by`", filter.CreatedBy); err != nil {
			return qb, err
		}
		qb, err = internal.AddAdditionalFilter(qb, filter.Wheres, filter.Joins, filter.LeftJoins, filter.GroupBys, filter.Havings)
		if err != nil {
			return qb, err
		}
	} else {
		if qb, err = internal.AddFilter(qb, "`training_event`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
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

func (ter *TrainingEventRepository) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	return ter.QueryBuilder.AddPagination(ctx, qb, pagination)
}

func (te *TrainingEventRepositoryQueryBuilder) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	fields := []string{
		"id",
		"fk_training",
		"status",
		"from",
		"completed_on",
		"duration",
		"active",
		"created_at",
		"updated_at",
		"created_by",
	}
	return internal.AddPagination(qb, pagination, "training_event", fields)
}

func (ter *TrainingEventRepository) FindAllTrainingEvent(ctx context.Context, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error) {
	return ter.FindAllTrainingEventWithSuffix(ctx, filter, pagination)
}

func (ter *TrainingEventRepository) FindAllTrainingEventWithSuffix(ctx context.Context, filter *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error) {
	var list table.ListTrainingEvent
	qb, err := ter.FindAllTrainingEventBaseQuery(ctx, filter, "`training_event`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb, err = ter.AddPagination(ctx, qb, pagination)
	if err != nil {
		return &list, err
	}

	err = ter.DB.Select(ctx, &list.Data, qb)

	if err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ter.FindAllTrainingEventBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &table.ListTrainingEvent{}, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	err = ter.DB.Get(ctx, &listMeta, qb)

	list.TotalCount = listMeta.Count

	return &list, err
}
func (ter *TrainingEventRepository) TrainingEventByID(ctx context.Context, id int, filter *table.TrainingEventFilter) (table.TrainingEvent, error) {
	return ter.TrainingEventByIDWithSuffix(ctx, id, filter)
}

func (ter *TrainingEventRepository) TrainingEventByIDWithSuffix(ctx context.Context, id int, filter *table.TrainingEventFilter, suffixes ...sq.Sqlizer) (table.TrainingEvent, error) {
	var err error

	// sql query
	qb, err := ter.FindAllTrainingEventBaseQuery(ctx, filter, "`training_event`.*", suffixes...)
	if err != nil {
		return table.TrainingEvent{}, err
	}
	qb = qb.Where(sq.Eq{"`training_event`.`id`": id})

	// run query
	te := table.TrainingEvent{}
	err = ter.DB.Get(ctx, &te, qb)
	if err != nil {
		return table.TrainingEvent{}, err
	}
	return te, nil
}

func (ter *TrainingEventRepository) TrainingEventByCreatedBy(ctx context.Context, createdBy sql.NullInt64, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error) {
	return ter.TrainingEventByCreatedByWithSuffix(ctx, createdBy, filter, pagination)
}

func (ter *TrainingEventRepository) TrainingEventByCreatedByWithSuffix(ctx context.Context, createdBy sql.NullInt64, filter *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error) {

	var list table.ListTrainingEvent
	// sql query
	qb, err := ter.FindAllTrainingEventBaseQuery(ctx, filter, "`training_event`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`training_event`.`created_by`": createdBy})

	if qb, err = ter.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = ter.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ter.FindAllTrainingEventBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`training_event`.`created_by`": createdBy})
	if err = ter.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}

func (ter *TrainingEventRepository) TrainingEventByFkTraining(ctx context.Context, fkTraining int, filter *table.TrainingEventFilter, pagination *internal.Pagination) (*table.ListTrainingEvent, error) {
	return ter.TrainingEventByFkTrainingWithSuffix(ctx, fkTraining, filter, pagination)
}

func (ter *TrainingEventRepository) TrainingEventByFkTrainingWithSuffix(ctx context.Context, fkTraining int, filter *table.TrainingEventFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListTrainingEvent, error) {

	var list table.ListTrainingEvent
	// sql query
	qb, err := ter.FindAllTrainingEventBaseQuery(ctx, filter, "`training_event`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`training_event`.`fk_training`": fkTraining})

	if qb, err = ter.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = ter.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ter.FindAllTrainingEventBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`training_event`.`fk_training`": fkTraining})
	if err = ter.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}
