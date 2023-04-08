package templates

type TemplateType uint16

const (
	ENUM TemplateType = iota
	TABLE
	REPO
	XO_WIRE
	GRAPH_SCHEMA
	RLTS
	GQLGEN
	ENUM_SCALAR
	XO_RESOLVER
)

func (tt *TemplateType) String() string {
	switch *tt {
	case ENUM:
		return "enum"
	case TABLE:
		return "table"
	case REPO:
		return "repo"
	case XO_WIRE:
		return "xo_wire"
	case RLTS:
		return "rlts"
	case GRAPH_SCHEMA:
		return "schema"
	case GQLGEN:
		return "gqlgen"
	case ENUM_SCALAR:
		return "scalar"
	case XO_RESOLVER:
		return "xo_resolver"
	}

	return ""
}

func (tt *TemplateType) Extension() string {
	switch *tt {
	case ENUM, TABLE, REPO, XO_WIRE, RLTS, XO_RESOLVER:
		return "go"
	case GRAPH_SCHEMA, ENUM_SCALAR:
		return "graphql"
	case GQLGEN:
		return "yml"
	}

	return ""
}
func (tt *TemplateType) PlaceAtRoot() bool {
	switch *tt {
	case XO_WIRE, GQLGEN, ENUM_SCALAR, XO_RESOLVER:
		return true
	}

	return false
}
