// Code generated by xo. DO NOT EDIT.

package table

import (
	"database/sql"
	"time"

	sq "github.com/elgris/sqrl"
	"github.com/ketan-10/training/backend/internal"
	"github.com/ketan-10/training/backend/xo_gen/enum"
	"github.com/pkg/errors"
)

type TrainingEvent struct {
	ID          int                      `json:"id" db:"id"`
	FkTraining  int                      `json:"fk_training" db:"fk_training"`
	Status      enum.TrainingEventStatus `json:"status" db:"status"`
	From        time.Time                `json:"from" db:"from"`
	CompletedOn time.Time                `json:"completed_on" db:"completed_on"`
	Duration    sql.NullInt64            `json:"duration" db:"duration"`
	Active      bool                     `json:"active" db:"active"`
	CreatedAt   sql.NullTime             `json:"created_at" db:"created_at"`
	UpdatedAt   sql.NullTime             `json:"updated_at" db:"updated_at"`
	CreatedBy   sql.NullInt64            `json:"created_by" db:"created_by"`
}

type TrainingEventFilter struct {
	ID          internal.FilterOnField
	FkTraining  internal.FilterOnField
	Status      internal.FilterOnField
	From        internal.FilterOnField
	CompletedOn internal.FilterOnField
	Duration    internal.FilterOnField
	Active      internal.FilterOnField
	CreatedAt   internal.FilterOnField
	UpdatedAt   internal.FilterOnField
	CreatedBy   internal.FilterOnField
	Wheres      []sq.Sqlizer
	Joins       []sq.Sqlizer
	LeftJoins   []sq.Sqlizer
	GroupBys    []string
	Havings     []sq.Sqlizer
}

func (f *TrainingEventFilter) NewFilter() interface{} {
	if f == nil {
		return &TrainingEventFilter{}
	}
	return f
}

func (f *TrainingEventFilter) TableName() string {
	return "`training_event`"
}

func (f *TrainingEventFilter) ModuleName() string {
	return "training_event"
}

func (f *TrainingEventFilter) IsNil() bool {
	return f == nil
}
func (f *TrainingEventFilter) AddID(filterType internal.FilterType, v interface{}) {
	f.ID = append(f.ID, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddFkTraining(filterType internal.FilterType, v interface{}) {
	f.FkTraining = append(f.FkTraining, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddStatus(filterType internal.FilterType, v interface{}) {
	f.Status = append(f.Status, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddFrom(filterType internal.FilterType, v interface{}) {
	f.From = append(f.From, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddCompletedOn(filterType internal.FilterType, v interface{}) {
	f.CompletedOn = append(f.CompletedOn, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddDuration(filterType internal.FilterType, v interface{}) {
	f.Duration = append(f.Duration, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddActive(filterType internal.FilterType, v interface{}) {
	f.Active = append(f.Active, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddCreatedAt(filterType internal.FilterType, v interface{}) {
	f.CreatedAt = append(f.CreatedAt, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddUpdatedAt(filterType internal.FilterType, v interface{}) {
	f.UpdatedAt = append(f.UpdatedAt, map[internal.FilterType]interface{}{filterType: v})
}
func (f *TrainingEventFilter) AddCreatedBy(filterType internal.FilterType, v interface{}) {
	f.CreatedBy = append(f.CreatedBy, map[internal.FilterType]interface{}{filterType: v})
}

func (f *TrainingEventFilter) Where(v sq.Sqlizer) *TrainingEventFilter {
	f.Wheres = append(f.Wheres, v)
	return f
}

func (f *TrainingEventFilter) Join(j sq.Sqlizer) *TrainingEventFilter {
	f.Joins = append(f.Joins, j)
	return f
}

func (f *TrainingEventFilter) LeftJoin(j sq.Sqlizer) *TrainingEventFilter {
	f.LeftJoins = append(f.LeftJoins, j)
	return f
}

func (f *TrainingEventFilter) GroupBy(gb string) *TrainingEventFilter {
	f.GroupBys = append(f.GroupBys, gb)
	return f
}

func (f *TrainingEventFilter) Having(h sq.Sqlizer) *TrainingEventFilter {
	f.Havings = append(f.Havings, h)
	return f
}

type TrainingEventCreate struct {
	FkTraining  int                      `json:"fk_training" db:"fk_training"`
	Status      enum.TrainingEventStatus `json:"status" db:"status"`
	From        time.Time                `json:"from" db:"from"`
	CompletedOn time.Time                `json:"completed_on" db:"completed_on"`
	Duration    sql.NullInt64            `json:"duration" db:"duration"`
	CreatedBy   sql.NullInt64            `json:"created_by" db:"created_by"`
}

// TODO: We have to exclude AutoGenerated fields
// For now I am keeping it in, as not sure how it affects
type TrainingEventUpdate struct {
	FkTraining  *int                      // fk_training
	Status      *enum.TrainingEventStatus // status
	From        *time.Time                // from
	CompletedOn *time.Time                // completed_on
	Duration    *sql.NullInt64            // duration
	Active      *bool                     // active
	CreatedBy   *sql.NullInt64            // created_by
}

// helper functions
func (u *TrainingEventUpdate) ToTrainingEventCreate() (res TrainingEventCreate, err error) {
	if u.FkTraining != nil {
		res.FkTraining = *u.FkTraining
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.Status != nil {
		res.Status = *u.Status
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.From != nil {
		res.From = *u.From
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.CompletedOn != nil {
		res.CompletedOn = *u.CompletedOn
	} else {
		return res, errors.New("Value Can not be NULL")
	}
	if u.Duration != nil {
		res.Duration = *u.Duration
	}
	if u.CreatedBy != nil {
		res.CreatedBy = *u.CreatedBy
	}
	return res, nil
}

type ListTrainingEvent struct {
	TotalCount int
	Data       []TrainingEvent
}

func (l *ListTrainingEvent) GetAllID() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.ID)
	}
	return res
}
func (l *ListTrainingEvent) GetAllFkTraining() []int {
	var res []int
	for _, item := range l.Data {
		res = append(res, item.FkTraining)
	}
	return res
}
func (l *ListTrainingEvent) GetAllStatus() []enum.TrainingEventStatus {
	var res []enum.TrainingEventStatus
	for _, item := range l.Data {
		res = append(res, item.Status)
	}
	return res
}
func (l *ListTrainingEvent) GetAllFrom() []time.Time {
	var res []time.Time
	for _, item := range l.Data {
		res = append(res, item.From)
	}
	return res
}
func (l *ListTrainingEvent) GetAllCompletedOn() []time.Time {
	var res []time.Time
	for _, item := range l.Data {
		res = append(res, item.CompletedOn)
	}
	return res
}
func (l *ListTrainingEvent) GetAllDuration() []sql.NullInt64 {
	var res []sql.NullInt64
	for _, item := range l.Data {
		res = append(res, item.Duration)
	}
	return res
}
func (l *ListTrainingEvent) GetAllActive() []bool {
	var res []bool
	for _, item := range l.Data {
		res = append(res, item.Active)
	}
	return res
}
func (l *ListTrainingEvent) GetAllCreatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.CreatedAt)
	}
	return res
}
func (l *ListTrainingEvent) GetAllUpdatedAt() []sql.NullTime {
	var res []sql.NullTime
	for _, item := range l.Data {
		res = append(res, item.UpdatedAt)
	}
	return res
}
func (l *ListTrainingEvent) GetAllCreatedBy() []sql.NullInt64 {
	var res []sql.NullInt64
	for _, item := range l.Data {
		res = append(res, item.CreatedBy)
	}
	return res
}

func (l *ListTrainingEvent) Filter(f func(item TrainingEvent) bool) (res ListTrainingEvent) {
	for _, item := range l.Data {
		if f(item) {
			res.Data = append(res.Data, item)
		}
	}
	res.TotalCount = len(res.Data)
	return res
}

func (l *ListTrainingEvent) Find(f func(item TrainingEvent) bool) (res TrainingEvent, found bool) {
	for _, item := range l.Data {
		if f(item) {
			return item, true
		}
	}
	return TrainingEvent{}, false
}

func (l *ListTrainingEvent) MapByCreatedBy() (m map[sql.NullInt64]ListTrainingEvent) {
	m = make(map[sql.NullInt64]ListTrainingEvent)
	for _, item := range l.Data {
		list := m[item.CreatedBy]
		list.Data = append(list.Data, item)

		m[item.CreatedBy] = list
	}
	for k, v := range m {
		v.TotalCount = len(v.Data)
		m[k] = v
	}
	return m
}

func (l *ListTrainingEvent) MapByFkTraining() (m map[int]ListTrainingEvent) {
	m = make(map[int]ListTrainingEvent)
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

func (l *ListTrainingEvent) MapByID() (m map[int]TrainingEvent) {
	m = make(map[int]TrainingEvent, len(l.Data))
	for _, item := range l.Data {
		m[item.ID] = item
	}
	return m
}
