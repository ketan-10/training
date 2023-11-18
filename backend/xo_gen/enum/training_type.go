// Code generated by xo. DO NOT EDIT.

package enum

import (
	"database/sql/driver"
	"errors"
	"io"
)

type TrainingType uint16

const (
	TrainingTypeProjectBase TrainingType = iota

	TrainingTypeOrganizationBase TrainingType = iota

	TrainingTypeSelfTraining TrainingType = iota
)

func (tt TrainingType) String() string {
	var value string

	switch tt {

	case TrainingTypeProjectBase:
		value = "project_base"

	case TrainingTypeOrganizationBase:
		value = "organization_base"

	case TrainingTypeSelfTraining:
		value = "self_training"

	}

	return value
}

func (tt TrainingType) GoString() string {
	return tt.String()
}

// MarshalGQL implements the graphql.Marshaler interface
func (tt TrainingType) MarshalGQL(w io.Writer) {
	w.Write([]byte(`"` + tt.String() + `"`))
}

// UnmarshalGQL implements the graphql.Marshaler interface
func (tt *TrainingType) UnmarshalGQL(v interface{}) error {
	if str, ok := v.(string); ok {
		return tt.UnmarshalText([]byte(str))
	}
	return errors.New("ErrInvalidEnumGraphQL")
}

// MarshalText marshals TrainingType into text.
func (tt TrainingType) MarshalText() ([]byte, error) {
	return []byte(tt.String()), nil
}

// UnmarshalText unmarshals TrainingType from text.
func (tt *TrainingType) UnmarshalText(text []byte) error {
	switch string(text) {
	case "project_base":
		*tt = TrainingTypeProjectBase

	case "organization_base":
		*tt = TrainingTypeOrganizationBase

	case "self_training":
		*tt = TrainingTypeSelfTraining

	default:
		return errors.New("ErrInvalidEnumGraphQL_TrainingType")
	}

	return nil
}

// Value satisfies the sql/driver.Valuer interface for TrainingType.
func (tt TrainingType) Value() (driver.Value, error) {
	return tt.String(), nil
}

// Value satisfies the sql/driver.Valuer interface for TrainingType.
func (tt TrainingType) Ptr() *TrainingType {
	return &tt
}

// Scan satisfies the database/sql.Scanner interface for TrainingType.
func (tt *TrainingType) Scan(src interface{}) error {
	buf, ok := src.([]byte)
	if !ok {
		return errors.New("ErrInvalidEnumScan_TrainingType")
	}

	return tt.UnmarshalText(buf)
}