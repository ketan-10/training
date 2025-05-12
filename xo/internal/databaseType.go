package internal

type DatabaseType uint16

const (
	MYSQL = DatabaseType(1)
)

func (lt *DatabaseType) String() string {
	switch *lt {
	case MYSQL:
		return "mysql"
	}
	return ""
}
