// Code generated by xo. DO NOT EDIT.

package table

import (
	"database/sql"

	sq "github.com/elgris/sqrl"
	"github.com/ketan-10/training/backend/internal"
	"github.com/pkg/errors"
)

type Attendances struct {
	ID              int          `json:"id" db:"id"`
	FkTrainingEvent int          `json:"fk_training_event" db:"fk_training_event"`
	FkStudent       int          `json:"fk_student" db:"fk_student"`
	Active          bool         `json:"active" db:"active"`
	CreatedAt       sql.NullTime `json:"created_at" db:"created_at"`
	UpdatedAt       sql.NullTime `json:"updated_at" db:"updated_at"`
}

type AttendancesFilter struct {
	ID              internal.FilterOnField
	FkTrainingEvent internal.FilterOnField
	FkStudent       internal.FilterOnField
	Active          internal.FilterOnField
	CreatedAt       internal.FilterOnField
	UpdatedAt       internal.FilterOnField
	Wheres          []sq.Sqlizer
	Joins           []sq.Sqlizer
	LeftJoins       []sq.Sqlizer
	GroupBys        []string
	Havings         []sq.Sqlizer
}

func (f *AttendancesFilter) NewFilter() interface{} {
	if f == nil {
		return &AttendancesFilter{}
	}
	return f
}

func (f *AttendancesFilter) TableName() string {
	return "`attendances`"
}

func (f *AttendancesFilter) ModuleName() string {
	return "attendances"
}

func (f *AttendancesFilter) IsNil() bool {
	return f == nil
}
func (f *AttendancesFilter) AddID(filterType internal.FilterType, v interface{}) {
	f.ID = append(f.ID, map[internal.FilterType]interface{}{filterType: v})
}
func (f *AttendancesFilter) AddFkTrainingEvent(filterType internal.FilterType, v interface{}) {
	f.FkTrainingEvent = append(f.FkTrainingEvent, map[internal.FilterType]interface{}{filterType: v})
}
func (f *AttendancesFilter) AddFkStudent(filterType internal.FilterType, v interface{}) {
	f.FkStudent = append(f.FkStudent, map[internal.FilterType]interface{}{filterType: v})
}
func (f *AttendancesFilter) AddActive(filterType internal.FilterType, v interface{}) {
	f.Active = append(f.Active, map[internal.FilterType]interface{}{filterType: v})
}
func (f *AttendancesFilter) AddCreatedAt(filterType internal.FilterType, v interface{}) {
	f.CreatedAt = append(f.CreatedAt, map[internal.FilterType]interface{}{filterType: v})
}
func (f *AttendancesFilter) AddUpdatedAt(filterType internal.FilterType, v interface{}) {
	f.UpdatedAt = append(f.UpdatedAt, map[internal.FilterType]interface{}{filterType: v})
}

func (f *AttendancesFilter) Where(v sq.Sqlizer) *AttendancesFilter {
	f.Wheres = append(f.Wheres, v)
	return f
}

func (f *AttendancesFilter) Join(j sq.Sqlizer) *AttendancesFilter {
	f.Joins = append(f.Joins, j)
	return f
}

func (f *AttendancesFilter) LeftJoin(j sq.Sqlizer) *AttendancesFilter {
	f.LeftJoins = append(f.LeftJoins, j)
	return f
}

func (f *AttendancesFilter) GroupBy(gb string) *AttendancesFilter {
	f.GroupBys = append(f.GroupBys, gb)
	return f
}

func (f *AttendancesFilter) Having(h sq.Sqlizer) *AttendancesFilter {
	f.Havings = append(f.Havings, h)
	return f
}

type AttendancesCreate struct {
	FkTrainingEvent int `json:"fk_training_event" db:"fk_training_event"`
	FkStudent       int `json:"fk_student" db:"fk_student"`
}

// TODO: We have to exclude AutoGenerated fields
// For now I am keeping it in, as not sure how it affects
type AttendancesUpdate struct {
	FkTrainingEvent *int  // fk_training_event
	FkStudent       *int  // fk_student
	Active          *bool // active
}

// helper functions
func (u *AttendancesUpdate) ToAttendancesCreate() (res AttendancesCreate, err error) {
	if u.FkTrainingEvent != nil {
		res.FkTrainingEvent = *u.FkTrainingEvent
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.FkStudent != nil {
		res.FkStudent = *u.FkStudent
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	return res, nil
}

type ListAttendances struct {
	TotalCount int
	Data       []Attendances
}

func (l *ListAttendances) GetAllID() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.ID)
	}
	return res
}
func (l *ListAttendances) GetAllFkTrainingEvent() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.FkTrainingEvent)
	}
	return res
}
func (l *ListAttendances) GetAllFkStudent() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.FkStudent)
	}
	return res
}
func (l *ListAttendances) GetAllActive() []bool {
	var res []bool
	for _, item := range l.Data {
		res = append(res, item.Active)
	}
	return res
}
func (l *ListAttendances) GetAllCreatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.CreatedAt)
	}
	return res
}
func (l *ListAttendances) GetAllUpdatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.UpdatedAt)
	}
	return res
}

func (l *ListAttendances) Filter(f func(item Attendances) bool) (res ListAttendances) {
	for _, item := range l.Data {
		if f(item) {
			res.Data = append(res.Data, item)
		}
	}
	res.TotalCount = len(res.Data)
	return res
}

func (l *ListAttendances) Find(f func(item Attendances) bool) (res Attendances, found bool) {
	for _, item := range l.Data {
		if f(item) {
			return item, true
		}
	}
	return Attendances{}, false
}

func (l *ListAttendances) MapByFkStudent() (m map[int]ListAttendances) {
	m = make(map[int]ListAttendances)
	for _, item := range l.Data {
		list := m[item.FkStudent]
		list.Data = append(list.Data, item)

		m[item.FkStudent] = list
	}
	for k, v := range m {
		v.TotalCount = len(v.Data)
		m[k] = v
	}
	return m
}

func (l *ListAttendances) MapByFkTrainingEvent() (m map[int]ListAttendances) {
	m = make(map[int]ListAttendances)
	for _, item := range l.Data {
		list := m[item.FkTrainingEvent]
		list.Data = append(list.Data, item)

		m[item.FkTrainingEvent] = list
	}
	for k, v := range m {
		v.TotalCount = len(v.Data)
		m[k] = v
	}
	return m
}

func (l *ListAttendances) MapByID() (m map[int]Attendances) {
	m = make(map[int]Attendances, len(l.Data))
	for _, item := range l.Data {
		m[item.ID] = item
	}
	return m
}
