// Code generated by xo. DO NOT EDIT.

package table

import (
	"database/sql"

	sq "github.com/elgris/sqrl"
	"github.com/ketan-10/training/backend/internal"
	"github.com/pkg/errors"
)

type Registrations struct {
	ID                 int          `json:"id" db:"id"`
	FkInternalResource int          `json:"fk_internal_resource" db:"fk_internal_resource"`
	FkTraining         int          `json:"fk_training" db:"fk_training"`
	Active             bool         `json:"active" db:"active"`
	CreatedAt          sql.NullTime `json:"created_at" db:"created_at"`
	UpdatedAt          sql.NullTime `json:"updated_at" db:"updated_at"`
}

type RegistrationsFilter struct {
	ID                 internal.FilterOnField
	FkInternalResource internal.FilterOnField
	FkTraining         internal.FilterOnField
	Active             internal.FilterOnField
	CreatedAt          internal.FilterOnField
	UpdatedAt          internal.FilterOnField
	Wheres             []sq.Sqlizer
	Joins              []sq.Sqlizer
	LeftJoins          []sq.Sqlizer
	GroupBys           []string
	Havings            []sq.Sqlizer
}

func (f *RegistrationsFilter) NewFilter() interface{} {
	if f == nil {
		return &RegistrationsFilter{}
	}
	return f
}

func (f *RegistrationsFilter) TableName() string {
	return "`registrations`"
}

func (f *RegistrationsFilter) ModuleName() string {
	return "registrations"
}

func (f *RegistrationsFilter) IsNil() bool {
	return f == nil
}
func (f *RegistrationsFilter) AddID(filterType internal.FilterType, v interface{}) {
	f.ID = append(f.ID, map[internal.FilterType]interface{}{filterType: v})
}
func (f *RegistrationsFilter) AddFkInternalResource(filterType internal.FilterType, v interface{}) {
	f.FkInternalResource = append(f.FkInternalResource, map[internal.FilterType]interface{}{filterType: v})
}
func (f *RegistrationsFilter) AddFkTraining(filterType internal.FilterType, v interface{}) {
	f.FkTraining = append(f.FkTraining, map[internal.FilterType]interface{}{filterType: v})
}
func (f *RegistrationsFilter) AddActive(filterType internal.FilterType, v interface{}) {
	f.Active = append(f.Active, map[internal.FilterType]interface{}{filterType: v})
}
func (f *RegistrationsFilter) AddCreatedAt(filterType internal.FilterType, v interface{}) {
	f.CreatedAt = append(f.CreatedAt, map[internal.FilterType]interface{}{filterType: v})
}
func (f *RegistrationsFilter) AddUpdatedAt(filterType internal.FilterType, v interface{}) {
	f.UpdatedAt = append(f.UpdatedAt, map[internal.FilterType]interface{}{filterType: v})
}

func (f *RegistrationsFilter) Where(v sq.Sqlizer) *RegistrationsFilter {
	f.Wheres = append(f.Wheres, v)
	return f
}

func (f *RegistrationsFilter) Join(j sq.Sqlizer) *RegistrationsFilter {
	f.Joins = append(f.Joins, j)
	return f
}

func (f *RegistrationsFilter) LeftJoin(j sq.Sqlizer) *RegistrationsFilter {
	f.LeftJoins = append(f.LeftJoins, j)
	return f
}

func (f *RegistrationsFilter) GroupBy(gb string) *RegistrationsFilter {
	f.GroupBys = append(f.GroupBys, gb)
	return f
}

func (f *RegistrationsFilter) Having(h sq.Sqlizer) *RegistrationsFilter {
	f.Havings = append(f.Havings, h)
	return f
}

type RegistrationsCreate struct {
	FkInternalResource int `json:"fk_internal_resource" db:"fk_internal_resource"`
	FkTraining         int `json:"fk_training" db:"fk_training"`
}

// TODO: We have to exclude AutoGenerated fields
// For now I am keeping it in, as not sure how it affects
type RegistrationsUpdate struct {
	FkInternalResource *int  // fk_internal_resource
	FkTraining         *int  // fk_training
	Active             *bool // active
}

// helper functions
func (u *RegistrationsUpdate) ToRegistrationsCreate() (res RegistrationsCreate, err error) {
	if u.FkInternalResource != nil {
		res.FkInternalResource = *u.FkInternalResource
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.FkTraining != nil {
		res.FkTraining = *u.FkTraining
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	return res, nil
}

type ListRegistrations struct {
	TotalCount int
	Data       []Registrations
}

func (l *ListRegistrations) GetAllID() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.ID)
	}
	return res
}
func (l *ListRegistrations) GetAllFkInternalResource() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.FkInternalResource)
	}
	return res
}
func (l *ListRegistrations) GetAllFkTraining() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.FkTraining)
	}
	return res
}
func (l *ListRegistrations) GetAllActive() []bool {
	var res []bool
	for _, item := range l.Data {
		res = append(res, item.Active)
	}
	return res
}
func (l *ListRegistrations) GetAllCreatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.CreatedAt)
	}
	return res
}
func (l *ListRegistrations) GetAllUpdatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.UpdatedAt)
	}
	return res
}

func (l *ListRegistrations) Filter(f func(item Registrations) bool) (res ListRegistrations) {
	for _, item := range l.Data {
		if f(item) {
			res.Data = append(res.Data, item)
		}
	}
	res.TotalCount = len(res.Data)
	return res
}

func (l *ListRegistrations) Find(f func(item Registrations) bool) (res Registrations, found bool) {
	for _, item := range l.Data {
		if f(item) {
			return item, true
		}
	}
	return Registrations{}, false
}

func (l *ListRegistrations) MapByFkInternalResource() (m map[int]ListRegistrations) {
	m = make(map[int]ListRegistrations)
	for _, item := range l.Data {
		list := m[item.FkInternalResource]
		list.Data = append(list.Data, item)

		m[item.FkInternalResource] = list
	}
	for k, v := range m {
		v.TotalCount = len(v.Data)
		m[k] = v
	}
	return m
}

func (l *ListRegistrations) MapByFkTraining() (m map[int]ListRegistrations) {
	m = make(map[int]ListRegistrations)
	for _, item := range l.Data {
		list := m[item.FkTraining]
		list.Data = append(list.Data, item)

		m[item.FkTraining] = list
	}
	for k, v := range m {
		v.TotalCount = len(v.Data)
		m[k] = v
	}
	return m
}

func (l *ListRegistrations) MapByID() (m map[int]Registrations) {
	m = make(map[int]Registrations, len(l.Data))
	for _, item := range l.Data {
		m[item.ID] = item
	}
	return m
}
