# Training Portal

![db-diagram](training.svg)

## This project is created to be used as a starter template.

## TODO fix README, (currently these are napkin notes)
- Overview
  - Goose to Write MYSQL code with versioning.
    - Create a `<int>_<name>.sql` file. and run `bash do.sh migrate`.
    - Goose will run the .sql file and apply changes, In active database.
    - This way we can keep track of changes to database.
    - Goose will only run new Files. It keeps track of what files have ran in database table called `goose_db_version`.
  - Custom generated code using go-template, by reading MYSQL, Generate following files
    - **By reading Enums:**
      - Create an `uint16` extended type, by enumName.
      - Create contants by `name`+`type` using `itoa` to have int value starting from 0.
      - Create Methods on extended type, so it will implement
        - `graphql.Marshaler` -> So that enum can be Marshal and UnMarshal by gqlgen from Graphql query, as enums are scalar type in .graphql files.
        - `sql/driver.Valuer` and `database/sql.Scanner` -> So that 'repository' can perform *Insert* and *Select* Operations on the enum column.
    - **By reading Table:**
      - Create Table struct with all fields and `json:"<column_name>" db:"<column_name>"` to map object to json and db
      - Create CreateTable struct with all fields except (`id`, `created_at`, `updated_at` and `active`) <br>
              All fields will be mandetory
      - Create UpdateTable struct with all fields except (`id`, `created_at`, `updated_at`) <br>
              All fields will be opional, denoted by pointer which can be null.
      - Create TableFilter struct for all columns, each column will have type `FilterOnField`, and Some additionalFilters like where, joins etc.
      - Create A ListTable object, and some helper function on the ListTable struct. <br>
        - Filter and Find function.
        - GetSpecificColumn as a list.
        - By reading `indexes` a `MapBy` function, which will return Map with key as index column, and value as ListTable if non unique or Table if Unique.
    - **To read Indexes:**
      - We read indexes created on table.
      - Multi column indexes are expnded.
        - A multi-column index can still be effective even if you are only searching by a single column that is part of index
        - For example if you create an index on column (A, B, C). Mysql will create 3 seperate index (A), (A, B), (A, B, C)

      ```js
      // --> input
      {
        name: "hello"
        id: 1,
        unique: true,
        columns: [
          {name: col1, no: 1},
          {name: col1, no: 2},
          {name: col1, no: 3},
        ]
      }
      
      // --> output
      {
        name: "hello"
        id: 1,
        unique: true,
        columns: [
          {name: col1, no: 1},
          {name: col1, no: 2},
          {name: col1, no: 3},
        ]
      }
      {
        name: "hello"
        id: 1,
        unique: true,
        columns: [
          {name: col1, no: 1},
        ]
      }
      {
        name: "hello"
        id: 1,
        unique: true,
        columns: [
          {name: col1, no: 1},
          {name: col1, no: 2},
        ]
      }

      ```

    - **To Read ForeignKeys:**
      - We read all the foreignKeys for each table
      - each Foreign Key have following data:

        ```go
        type ForeignKey struct {
          ForeignKeyName string // the constrain name
          ColumnName     string // column containing the foreign key, usually starts with 'fk_'
          RefTableName   string // The table name it reffers to
          RefColumnName  string // the ref table Column to with the key points to, usually 'id' column    

          Column Column // column struct
          RefColumn Column // ref column struct
          RefTable Table // ref table struct
        }
        ```

      - After accumulating foreign keys for evey table. <br>
        For each table, we find what other tables are have foreign keys pointing to this table.
      - When This Table Pointing to Other Table!!!, ManyToOne <- As Many records from other table can point to this table one record
      - When other Table Pointing to This Table!!!, OneToMany <- As This Table record can point to Multiple Other table record

    - **To generate Repos**:
      We generate repository for each Table with following functions:
      - `Insert<Table>IDResult(<Table>Create, suffix)`:
        - Given the CreateTable struct, insert into table.
        - If present add suffix. example suffix -> "ON DUPLICATE KEY UPDATE". "FOR UPDATE"
        - Get the id of inserted item.
      - `Insert<Table>(<Table>Create, suffix) <Table>`:
        - Calls the above function InsertIdResult and fetch the the inserted entity so fields like `createdAt` can be populated.
      - `Update<Table>(<Table>)`:
        - Given TableEntity we create get the id and update all the fields (no null checks)
      - `Update<Table>()ByFields(id int, <Table>Update)`
        - Given TableUpdateEntity we check if the value is not null (i.e not exists) if not null we set it to `updateMap` and update the values in database.
        - After update we re-fetch the same record by `id` and return.
      - **QueryBuild:**
        - Query builder is a struct which is injected as dependency for `<Table>Repository` struct.
        - Query Builder has 2 methods (`FindAllBaseQuery`, `AddPagination`)
        - Both methods return a `github.com/elgris/sqrl.QueryBuilder` object. Which later used by `github.com/jmoiron/sqlx.Select` to fire query and get data.
        - In `FindAll<Table>BaseQuery(Fields, Filters)` We check for all columns if any filter is applied, if so we add it to queryBuilder. <br> We also pass the **Fields** to the QueryBuilder.Select, which might be eg. (`<table>.*` or `COUNT(1) AS count`)
        - In `AddPagination(QueryBuilder, PaginationObj) QueryBuilder` We call internal Pagination function in which we add **`Offset`, `Limit` and `Sort`** given by Pagination Object, and return the QueryBuilder.  
      - `FindAll<Table>(tableFitler, pagination)`
        - In this methods, Given the tableFilter we first call `QueryBuilder.FindAll<Table>BaseQuery` on all fields with `<table>.*`
        - Then we call `QueryBuilder.AddPagination` with given arguments.
        - Then we fire query with `jmoiron/sqlx.Select()` given `elgris/sqrl.QueryBuilder`
        - Then we again call `QueryBuilder.FindAll<Table>BaseQuery` with `COUNT(1) AS count` as fields to be the **count** with same QueryBuilder.
      - Finally For All **Indexes** on table we create Method `FindAll<Table>By<Index>`
        - Depending if Index is **Unique** or not we return `List<Table>Entity` or `<Table>Entity`.
    - **To generate rlts**:
      - ForeignKeysRef Methods. returning List
        - For `ForeignKeysRef` other table will have foreign key pointing to our table
        - As Every Foreign key is also a Index (in this case) we will have method `FindAll<table>By<index>()` on repository.
        - We can directly call the Index method of repository.
        - (Note: as the key might be nullable, we accept gotype as Nullable in repository ) So we have to parse the type to Nullable. depending if it's nullable or not we are checking it by `{{- if eq .Column.GoType .RefColumn.GoType }}`
      - ForeignKeys Methods. returning Single Item of refered table.
        - We had multiple ways to do this. The simplest would have been just use `Find<Table>ById()` method on repository.
        - But this assumes foreign keys will always be `id` of refered table.
        - In this case we are just adding to `filter` the `refColumnName`
      - We also have to find `UniqueTablesForRepoDependency` so that we don't inject same repository dependency multiple time in Rlts-struct for wiregen.
      - This methods will be used by GraphQL as custom resolver, that's why the argument of the function contains the original entity fetched form parent query.

## Backend

- **SQL first architecture and Goose:**
  - We start with writing SQL, And then the entities are generated by `xo` on reading the database. That's why I called It sql first.

- **gqlgen and schema first approch**
  - We are using Gqlgen to generate code to connect quries to functions.
  - Gqlgen is a schema first and not code first.
  - So you write the schema.graphql file and the entites can be auto generated by gqlgen.
  - But here we are creating *our own* graphql schema **and** go entities. <br>
  - We create our own custom model instead of auto-generating, As we want to have [custom resolvers](https://gqlgen.com/#how-do-i-prevent-fetching-child-objects-that-might-not-be-used) for foregin keys. SO that database will query only if requested.
  - For this Custom Resource gqlgen uses following resource Discovery logic.
    - Does the mapping entity provided in `gqlgen.yml` have all the reqired fields, If not then we have custom reolvers.
    - First, Call the `query` method to get the Golang Entity, (Note: Golang Entity is subset of Graphql entity) Then find the resolver for Entity.
    - The custom resolver methods required for entity is exposed as interface by gqlgen generated code by name `ResolverRoot`. we have to make the struct we pass to gqlgen config have these methods. We generate this in `xo_resolver.go`
    - ex. given following inputs.
      - `xo_config.yml` For custom resolver:

        ```yaml
        exclude_table:
          - goose_db_version
        graphql:
          include_field:
            attendances: 
              isTotal: ": Boolean!"
        ```  

      - `attendances.go` The file will be generated as from database structure as

        ```go
        type Attendance struct {
          ID int
          FKTrainingEvent int
          FkInternalResource int
          Active bool
        }
        ```

      - `attendances.graphql` The graphqlFile generated with database + `xo_config.yml` Custom resolvers, and FK relations if any.

        ```graphql
        type Attendance {
          id: Int!
          fkTrainingEvent: Int!
          fkInternalResource: Int!
          active: Boolean!

          isTotal: Boolean!

          trainingEventByFkTrainingEvent(filter: TrainingEventFilter): TrainingEvent
          internalResourcesByInternalResource(filter: InternalResourcesFilter): InternalResources
        }
        ```

      - `gqlgen.yml` We will attach graphql to Model.

        ```yaml
        Attendances:
          model: ../xo_gen/table.Attendances
        ```

      - Gqlgen will detect the missing fields, as for other fields we already have resolver, so gqlgen will expect `ResolverRoot` as follows (**Generated code bellow**)

        ```go
        type ResolverRoot interface {
          Attendances() AttendancesResolver
        }

        type AttendancesResolver interface {
          
          IsTotal(ctx Context, obj *table.Attendance) (bool, error)

          TrainingEventByFkTrainingEvent(ctx Context, obj *table.Attendance, filter TrainingEventFilter) (*table.TrainingEvent, error)
          InternalResourcesByInternalResource(ctx Context, obj *table.Attendance, filter InternalResourcesFilter) (*table.InternalResources, error)
        }
        ```

      - The above 3 methods will are implemented in
        1. In `IAttendancesRltsRepository` `TrainingEventByFkTrainingEvent` and `InternalResourcesByInternalResource` are defined.
        2. `IsTotal` in `resolver` folder.
      - In resolver folder `attendance_resolver.go`

        ```go
          type IAttendanceResolver interface {
            rlts.IAttendancesRltsRepository
            IsTotal(ctx Context, obj *table.Attendance) (bool, error)
          }
          type AttendanceResolver struct {
            rlts.IAttendancesRltsRepository
            // Other dependencies if required by IsTotal func eg UserService
          }
          func (ar *AttendanceResolver) IsTotal(ctx Context, obj *table.Attendance) (bool, error){
            // special logic if needed eg ar.UserService.Id > 0
            return obj.active;
          }
        ```

      - finally in `xo_resolver.go` we implement `ResolverRoot`

        ```go
          type Resolver struct {
            repo.IAttendanceRepository
            rlts.IAttendanceRltsRepository
            resolver.IAttendanceResolver
            // .... many more
          }

          var NewResolver = wire.NewSet(wire.Struct(new(Resolver), "*"))

          func (r Resolver) Attendance() gen.AttendancesResolver {
            return r.IAttendanceResolver
          }
        ```

      - the resolver object is given to global Application object. where wire injects it to App{} (more about wire in latter section)

        ```go
          type App{
            Resolver resolver.Resolver
          }
        ```

      - The `ResolverRoot` is passed on application creation in `server.go` as `gen.Config{Resolvers: app.Resolver}`.

- **Go Mod:**
  - As go mod uses direct URLs. And we are using our own library `xo`, <br> Each time we update `xo` we have to push it to github, so that `backend` can `go mod tidy` lattest version.
  - Above problem is solved by adding following in go.mod file. <br>
      So that we are pointing to local files, so go mod does not query the web.

    ```
    replace github.com/ketan-10/training/xo => /home/ketan/go/src/training/xo
    ```

- **golang**
  - [Learn Go Programming - Golang Tutorial for Beginners](https://www.youtube.com/watch?v=YS4e4q9oBaU)
  - [The Flaws of Inheritance](https://youtu.be/hxGOiiR9ZKg)
  - Dependency
    - Go Does not allow cyclic dependency, it gives error as `import cycle not allowed` <br>
        Though interpreted language like python support it on some level [Example 👆](https://stackoverflow.com/a/744410/10066692) <br>
        I think it should have been possible with [linking step like in C++](https://www.youtube.com/watch?v=H4s55GgAg0I&list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb&index=7)

    - [Go team approach to from Dependency management tool before `go mod` or `go dep` on Medium](https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527)
  - Tools
    - We can install dev-tools using go mod.
    - Go does not support dev-dependency.
    - So to avoid tools to end up in prod executable. We add `// +build tools` at top, <br>
        So that they will be only included if we build code with `+ tools` while building/

    - For dev-dependency go recommend following ([Github Issue](https://github.com/golang/go/issues/25922#issuecomment-1038394599)).

    - for example:

        ```go
        //go:build tools
        // +build tools

        package tools

        import (
            _ "github.com/99designs/gqlgen"
        )
        ```

    - After tools are setup we can run Run: **`go run github.com/99designs/gqlgen <command>`**

- **Filters**
  - Here we provide functionality to add filters, So the graqhql query with filters. <br>
    In below example we are using filter with id in findAllUser <br>
    Also we are fetching internal resources created by user, there we add filter for `projectName` <br>
    So internalResouces will be fetched by "created by userId: `2`, `3`, `4` **and** with projectName: `abc`"

    ```graphql
    query findusers {
      findAllUser(filter: {
        id: {
          gt: 1
          lt: 5
        }
      }) {
        totalCount
        data {
          username
          internalResourcesByCreatedBy(
            filter: {
              projectName: "abc"
            }
          ) {
            data {
              name
            }
          }    
        }
      } 
    }
    ```

  - When generating graphql files we provide

    ```graphql
    scalar FilterOnField
    ```

    Scalar can have any value.

  - We have to explicitly provide `MarshalGQL` and `UnmarshalGQL` for this in attached go model (provided in `gqlgen.yml` under models), <br>
    By implementing graphql.Marshaler interface.
  
  - FilterOnField is Marshaled into go type:
  
  ```go
    type FilterOnField []map[FilterType]interface{}

    type FilterType string 
    // enum of 'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'between' 
  ```

  - Example of possible filter on a column, it will fetch if column value is `8` or `9`

  ```js
    FilterOnField = [
      {
        "gt": 5,
        "lt": 10
      },
      {
        "gt": 7
      }
    ]
  ```

  - In graphql query we only specify **one** `map[FilterType]interface{}`, but we use it's **Array** to applyFilter, due to we might use multiple filter in sevices or resolver in golang code.

  - All filters are consolidated as `sq.And` and applied on `SelectBuild.where()` in AddFilter.

  - Also We have additional filter like (`Where`, `Join`, `LeftJoin`, `GroupBy`, `Having`) which are applied in `AddAdditionalFilter` method. by converting to sql string and passed to query builder.

- **Pagination**
  - Besides filter we also have pagination as argument on each query in .graphql.
  - So we also add Pagination to query functions like eg. `findAll` in repository.
  - Pagination is defined as following in pagination.graphql:
  
  ```graphql
    input Pagination {
      page: Int
      perPage: Int
      sort: [String!]
    }
  ```

  - And mapped to internal.Pagination struct in gqlgen-yml

  ```yaml
    Pagination:
      model: ../internal.Pagination
  ```

  - In repository, pegination is applied with query-builder before applying the query.
  - Pagination adds `Offset` and `Limit` to query-builder.

- **wire**
  - Wire is a dependency injection library developed by google.
  - We have extensively used this to inject repository, services.
  - Anywhere we have to intansiate a struct, we expose it to wire using `wire.NewSet`
  eg.

    ```go
    var NewAuthService = wire.NewSet(wire.Struct(new(AuthService), "*"), wire.Bind(new(IAuthService), new(AuthService)))
    ```

  - On running `do.sh wire` following code processing will happne (might be considered as **compile-time**)
    - The entire code will be scanned for use of `wire.NewSet()` to accumulate all the possible objects and functions avaliable.
    - Again wire will scan code to find function with `wire.Build(NewSet)` written.
    - This will not be a real function, but like a configuration fucntion which will **never run**. <br>
    The only use of this function is to tell `wire` generate the following object. eg.

      ```go
      func GetApp(ctx context.Context) (*App, func(), error) {
        wire.Build(globalSet)
        return &App{}, nil, nil
      }
      ```

    - The **App** object

      ```go
      type App struct {
        AuthService services.IAuthService
      }
      ```

    - eg `globalSet` might be

      ```go
      var globalSet = wire.NewSet(
        NewAuthService,
        wire.Struct(new(App), "*"),
      )
      ```

    - Given above function and object wire will generate &App{} object. <br> And generate the same signature function which will return the real object.
  - So just like any other dependency injection tool. wire helps us to just declear with it's dependencies. and add it to wire. the dependencies will be automatically injected on runtime. <br>
  - Wire will scan form top to bottom. top being the initial point e.g `GetApp` function.
- **Login service**
  - To create Login Service (Auth service) first we add Query to our schema, and run gqlgen

    ```graphql
    type Query {
      login(email: String!, password: String!): String!
    }
    ```

  - After running gql-gen we note that our QueryResolver now expects login function.

    ```go
    type QueryResolver interface {
      Login(ctx context.Context, email string, password string) (string, error)
    }
    ```

  - We implement the login funciton in `services/auth_service.go`.

    ```go
    type IAuthService interface {
      Login(ctx context.Context, email string, password string) (string, error)
    }

    type AuthService struct {
      UserRepository repo.IUserRepository
    }

    var NewAuthService = wire.NewSet(wire.Struct(new(AuthService), "*"), wire.Bind(new(IAuthService), new(AuthService)))

    // Login Login for all users in the system
    func (us *AuthService) Login(ctx context.Context, email string, password string) (string, error) {
      // generate and return token
    }
    ```

  - Finally we add `services.IAuthService` to our resover so it QueryResolver can find it.

    ```go
    type Resolver struct {
      xo_gen.XoResolver
      services.IAuthService
    }

    func (r *Resolver) Query() gen.QueryResolver {
      return r
    }
    ```

- **Middleware and graphql Directives/Annotation Middleware**
  - We have 2 types of middlewares
  - `Chi` middleware used in `router.Use()`
    - For Chi middleware is executated for **each request**.
    - In this project we are using it as checking if header have Bearer token. If exists add it to `context`. and call `next()`
  - `Graphql` middleware used as annotation in .graphql file `@authenticate`
    - For Graphql middleware it is executated only if query have the annotation eg.

    ```graphql
    findAllUser(filter: UserFilter, pagination: Pagination): ListUser! @authenticate
    ```

    - to apply the middleware in `server.go` we do:

    ```go
    c.Directives.Authenticate = app.GraphqlAuthenticateMiddleware.Handle
    ```

    - In this middleware we check if the token is valid and should user be allowed further.
