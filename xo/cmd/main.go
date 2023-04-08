package cmd

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/alexflint/go-arg"
	"github.com/ketan-10/classroom/xo/internal"
	"gopkg.in/yaml.v3"

	// empty import, so that init method will be called, and drivers will be loaded
	_ "github.com/ketan-10/classroom/xo/loaders"
	"github.com/xo/dburl"
)

func Execute() {

	var err error
	fmt.Println("Started")

	err = parseXoConfigFile()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	args := internal.GetDefaultArgs()

	// validate Args
	arg.MustParse(args)

	// open DB and save it to args
	err = openDB(args)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer args.DB.Close()

	// loaders
	err = getLoaderOfDriver(args)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	err = args.Loader.LoadSchema(args)

	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	// create files

	generateFiles(args)
}

func generateFiles(args *internal.Args) {

	for _, gen := range args.Generated {

		dirName := "./" + args.GeneratedDir
		if !gen.TemplateType.PlaceAtRoot() {
			dirName += "/" + gen.TemplateType.String()
		}

		if _, err := os.Stat(dirName); os.IsNotExist(err) {
			os.MkdirAll(dirName, os.ModeDir)
		}
		file, err := os.Create(dirName + "/" + gen.FileName + "." + gen.TemplateType.Extension())
		if err != nil {
			panic(err)
		}
		defer file.Close()

		_, err = file.Write(gen.Buffer.Bytes())
		if err != nil {
			panic(err)
		}

	}
}

func openDB(args *internal.Args) error {
	url, err := dburl.Parse(args.DBC)
	if err != nil {
		return err
	}

	if url.Driver != "mysql" {
		// This can be extended for others
		return fmt.Errorf("only mysql is supported for xo-patcher not %s", url.Driver)
	}

	// enum 🤮
	lt := internal.LoaderType(0)
	lt.Unmarshal(url.Driver)
	args.LoaderType = lt

	// open mysql connection
	args.DB, err = sql.Open(url.Driver, url.DSN)
	if err != nil {
		return err
	}
	return nil
}

func getLoaderOfDriver(args *internal.Args) error {
	var ok bool
	args.Loader, ok = internal.AllLoaders[args.LoaderType]
	if !ok {
		return fmt.Errorf("for driver %s, no registered loader found", args.LoaderType.String())
	}
	return nil
}

func parseXoConfigFile() error {
	data, err := os.ReadFile("xo_config.yml")
	if err != nil {
		return err
	}
	err = yaml.Unmarshal(data, &internal.XoConfig)

	fmt.Println(internal.XoConfig.ExcludeTable)
	if err != nil {
		return err
	}
	return nil
}
