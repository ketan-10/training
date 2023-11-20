// Code generated by xo. DO NOT EDIT.

package repo

import (
	"context"

	sq "github.com/elgris/sqrl"
	"github.com/google/wire"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/table"
)

type IUserRepository interface {
	IUserRepositoryQueryBuilder

	InsertUser(ctx context.Context, u table.UserCreate) (*table.User, error)
	InsertUserWithSuffix(ctx context.Context, u table.UserCreate, suffix sq.Sqlizer) (*table.User, error)
	InsertUserIDResult(ctx context.Context, u table.UserCreate, suffix sq.Sqlizer) (int64, error)

	UpdateUserByFields(ctx context.Context, id int, u table.UserUpdate) (*table.User, error)
	UpdateUser(ctx context.Context, u table.User) (*table.User, error)

	DeleteUser(ctx context.Context, u table.User) error
	DeleteUserByID(ctx context.Context, id int) (bool, error)

	FindAllUser(ctx context.Context, u *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error)
	FindAllUserWithSuffix(ctx context.Context, u *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error)
	UserByEmailActive(ctx context.Context, email string, active bool, filter *table.UserFilter) (table.User, error)

	UserByEmailActiveWithSuffix(ctx context.Context, email string, active bool, filter *table.UserFilter, suffixes ...sq.Sqlizer) (table.User, error)

	UserByEmail(ctx context.Context, email string, filter *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error)

	UserByEmailWithSuffix(ctx context.Context, email string, filter *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error)

	UserByUsername(ctx context.Context, username string, filter *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error)

	UserByUsernameWithSuffix(ctx context.Context, username string, filter *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error)
	UserByID(ctx context.Context, id int, filter *table.UserFilter) (table.User, error)

	UserByIDWithSuffix(ctx context.Context, id int, filter *table.UserFilter, suffixes ...sq.Sqlizer) (table.User, error)
}

type IUserRepositoryQueryBuilder interface {
	FindAllUserBaseQuery(ctx context.Context, filter *table.UserFilter, fields string, suffix ...sq.Sqlizer) (*sq.SelectBuilder, error)
	AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error)
}

type UserRepository struct {
	DB           internal.IDb
	QueryBuilder IUserRepositoryQueryBuilder
}

type UserRepositoryQueryBuilder struct {
}

var NewUserRepository = wire.NewSet(
	wire.Struct(new(UserRepository), "*"),
	wire.Struct(new(UserRepositoryQueryBuilder), "*"),
	wire.Bind(new(IUserRepository), new(*UserRepository)),
	wire.Bind(new(IUserRepositoryQueryBuilder), new(*UserRepositoryQueryBuilder)),
)

func (ur *UserRepository) InsertUser(ctx context.Context, u table.UserCreate) (*table.User, error) {
	return ur.InsertUserWithSuffix(ctx, u, nil)
}

func (ur *UserRepository) InsertUserWithSuffix(ctx context.Context, u table.UserCreate, suffix sq.Sqlizer) (*table.User, error) {
	var err error

	id, err := ur.InsertUserIDResult(ctx, u, suffix)
	if err != nil {
		return nil, err
	}
	newu := table.User{}
	qb := sq.Select("*").From(`user`)

	qb.Where(sq.Eq{"`id`": id})
	err = ur.DB.Get(ctx, &newu, qb)

	if err != nil {
		return nil, err
	}
	return &newu, nil
}

func (ur *UserRepository) InsertUserIDResult(ctx context.Context, u table.UserCreate, suffix sq.Sqlizer) (int64, error) {
	var err error

	qb := sq.Insert("`user`").Columns(
		"`username`",
		"`email`",
		"`password`",
		"`role`",
	).Values(
		u.Username,
		u.Email,
		u.Password,
		u.Role,
	)
	if suffix != nil {
		suffixQuery, suffixArgs, suffixErr := suffix.ToSql()
		if suffixErr != nil {
			return 0, suffixErr
		}
		qb.Suffix(suffixQuery, suffixArgs...)
	}

	// run query
	res, err := ur.DB.Exec(ctx, qb)
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

func (ur *UserRepository) UpdateUserByFields(ctx context.Context, id int, u table.UserUpdate) (*table.User, error) {
	var err error

	updateMap := map[string]interface{}{}
	if u.Username != nil {
		updateMap["`username`"] = *u.Username
	}
	if u.Email != nil {
		updateMap["`email`"] = *u.Email
	}
	if u.Password != nil {
		updateMap["`password`"] = *u.Password
	}
	if u.Role != nil {
		updateMap["`role`"] = *u.Role
	}
	if u.Active != nil {
		updateMap["`active`"] = *u.Active
	}

	qb := sq.Update(`user`).SetMap(updateMap).Where(sq.Eq{"`id`": id})

	_, err = ur.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`user`")

	selectQb = selectQb.Where(sq.Eq{"`id`": id})

	result := table.User{}
	err = ur.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (ur *UserRepository) UpdateUser(ctx context.Context, u table.User) (*table.User, error) {
	var err error

	// sql query
	qb := sq.Update("`user`").SetMap(map[string]interface{}{
		"`username`": u.Username,
		"`email`":    u.Email,
		"`password`": u.Password,
		"`role`":     u.Role,
		"`active`":   u.Active,
	}).Where(sq.Eq{"`id`": u.ID})

	// run query
	_, err = ur.DB.Exec(ctx, qb)
	if err != nil {
		return nil, err
	}

	selectQb := sq.Select("*").From("`user`")
	selectQb = selectQb.Where(sq.Eq{"`id`": u.ID})

	result := table.User{}
	err = ur.DB.Get(ctx, &result, selectQb)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (ur *UserRepository) DeleteUser(ctx context.Context, u table.User) error {
	_, err := ur.DeleteUserByID(ctx, u.ID)
	return err
}

func (ur *UserRepository) DeleteUserByID(ctx context.Context, id int) (bool, error) {
	var err error

	qb := sq.Update("`user`").Set("active", false)

	qb = qb.Where(sq.Eq{"`id`": id})

	_, err = ur.DB.Exec(ctx, qb)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (ur *UserRepository) FindAllUserBaseQuery(ctx context.Context, filter *table.UserFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	return ur.QueryBuilder.FindAllUserBaseQuery(ctx, filter, fields, suffixes...)
}

func (ur *UserRepositoryQueryBuilder) FindAllUserBaseQuery(ctx context.Context, filter *table.UserFilter, fields string, suffixes ...sq.Sqlizer) (*sq.SelectBuilder, error) {
	var err error
	qb := sq.Select(fields).From("`user`")
	if filter != nil {
		if qb, err = internal.AddFilter(qb, "`user`.`id`", filter.ID); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`user`.`username`", filter.Username); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`user`.`email`", filter.Email); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`user`.`password`", filter.Password); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`user`.`role`", filter.Role); err != nil {
			return qb, err
		}
		if filter.Active == nil {
			if qb, err = internal.AddFilter(qb, "`user`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
				return qb, err
			}
		} else {
			if qb, err = internal.AddFilter(qb, "`user`.`active`", filter.Active); err != nil {
				return qb, err
			}
		}
		if qb, err = internal.AddFilter(qb, "`user`.`created_at`", filter.CreatedAt); err != nil {
			return qb, err
		}
		if qb, err = internal.AddFilter(qb, "`user`.`updated_at`", filter.UpdatedAt); err != nil {
			return qb, err
		}
		qb, err = internal.AddAdditionalFilter(qb, filter.Wheres, filter.Joins, filter.LeftJoins, filter.GroupBys, filter.Havings)
		if err != nil {
			return qb, err
		}
	} else {
		if qb, err = internal.AddFilter(qb, "`user`.`active`", internal.FilterOnField{{internal.Eq: true}}); err != nil {
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

func (ur *UserRepository) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	return ur.QueryBuilder.AddPagination(ctx, qb, pagination)
}

func (u *UserRepositoryQueryBuilder) AddPagination(ctx context.Context, qb *sq.SelectBuilder, pagination *internal.Pagination) (*sq.SelectBuilder, error) {
	fields := []string{
		"id",
		"username",
		"email",
		"password",
		"role",
		"active",
		"created_at",
		"updated_at",
	}
	return internal.AddPagination(qb, pagination, "user", fields)
}

func (ur *UserRepository) FindAllUser(ctx context.Context, filter *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error) {
	return ur.FindAllUserWithSuffix(ctx, filter, pagination)
}

func (ur *UserRepository) FindAllUserWithSuffix(ctx context.Context, filter *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error) {
	var list table.ListUser
	qb, err := ur.FindAllUserBaseQuery(ctx, filter, "`user`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb, err = ur.AddPagination(ctx, qb, pagination)
	if err != nil {
		return &list, err
	}

	err = ur.DB.Select(ctx, &list.Data, qb)

	if err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ur.FindAllUserBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &table.ListUser{}, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	err = ur.DB.Get(ctx, &listMeta, qb)

	list.TotalCount = listMeta.Count

	return &list, err
}
func (ur *UserRepository) UserByEmailActive(ctx context.Context, email string, active bool, filter *table.UserFilter) (table.User, error) {
	return ur.UserByEmailActiveWithSuffix(ctx, email, active, filter)
}

func (ur *UserRepository) UserByEmailActiveWithSuffix(ctx context.Context, email string, active bool, filter *table.UserFilter, suffixes ...sq.Sqlizer) (table.User, error) {
	var err error

	// sql query
	qb, err := ur.FindAllUserBaseQuery(ctx, filter, "`user`.*", suffixes...)
	if err != nil {
		return table.User{}, err
	}
	qb = qb.Where(sq.Eq{"`user`.`email`": email})
	qb = qb.Where(sq.Eq{"`user`.`active`": active})

	// run query
	u := table.User{}
	err = ur.DB.Get(ctx, &u, qb)
	if err != nil {
		return table.User{}, err
	}
	return u, nil
}

func (ur *UserRepository) UserByEmail(ctx context.Context, email string, filter *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error) {
	return ur.UserByEmailWithSuffix(ctx, email, filter, pagination)
}

func (ur *UserRepository) UserByEmailWithSuffix(ctx context.Context, email string, filter *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error) {

	var list table.ListUser
	// sql query
	qb, err := ur.FindAllUserBaseQuery(ctx, filter, "`user`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`user`.`email`": email})

	if qb, err = ur.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = ur.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ur.FindAllUserBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`user`.`email`": email})
	if err = ur.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}

func (ur *UserRepository) UserByUsername(ctx context.Context, username string, filter *table.UserFilter, pagination *internal.Pagination) (*table.ListUser, error) {
	return ur.UserByUsernameWithSuffix(ctx, username, filter, pagination)
}

func (ur *UserRepository) UserByUsernameWithSuffix(ctx context.Context, username string, filter *table.UserFilter, pagination *internal.Pagination, suffixes ...sq.Sqlizer) (*table.ListUser, error) {

	var list table.ListUser
	// sql query
	qb, err := ur.FindAllUserBaseQuery(ctx, filter, "`user`.*", suffixes...)
	if err != nil {
		return &list, err
	}
	qb = qb.Where(sq.Eq{"`user`.`username`": username})

	if qb, err = ur.AddPagination(ctx, qb, pagination); err != nil {
		return &list, err
	}

	// run query
	if err = ur.DB.Select(ctx, &list.Data, qb); err != nil {
		return &list, err
	}

	if pagination == nil || pagination.PerPage == nil || pagination.Page == nil {
		list.TotalCount = len(list.Data)
		return &list, nil
	}

	var listMeta internal.ListMetadata
	if qb, err = ur.FindAllUserBaseQuery(ctx, filter, "COUNT(1) AS count"); err != nil {
		return &list, err
	}
	if filter != nil && len(filter.GroupBys) > 0 {
		qb = sq.Select("COUNT(1) AS count").FromSelect(qb, "a")
	}
	qb = qb.Where(sq.Eq{"`user`.`username`": username})
	if err = ur.DB.Get(ctx, &listMeta, qb); err != nil {
		return &list, err
	}

	list.TotalCount = listMeta.Count

	return &list, nil

}
func (ur *UserRepository) UserByID(ctx context.Context, id int, filter *table.UserFilter) (table.User, error) {
	return ur.UserByIDWithSuffix(ctx, id, filter)
}

func (ur *UserRepository) UserByIDWithSuffix(ctx context.Context, id int, filter *table.UserFilter, suffixes ...sq.Sqlizer) (table.User, error) {
	var err error

	// sql query
	qb, err := ur.FindAllUserBaseQuery(ctx, filter, "`user`.*", suffixes...)
	if err != nil {
		return table.User{}, err
	}
	qb = qb.Where(sq.Eq{"`user`.`id`": id})

	// run query
	u := table.User{}
	err = ur.DB.Get(ctx, &u, qb)
	if err != nil {
		return table.User{}, err
	}
	return u, nil
}
