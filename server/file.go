package main

import (
	"os"
	"path/filepath"
)

func ReadFile(path string) (data []byte, err error) {
	data, err = os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return
}

func WalkDir(startPath string, action func(filePath string)) (err error) {
	walkFunc := func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			action(path)
		}
		return nil
	}

	filepath.WalkDir(startPath, walkFunc)

	return err
}

func WriteFile(path string, b []byte) (err error) {
	dirErr := os.MkdirAll(path, 0o777)
	if dirErr != nil {
		return dirErr
	}

	return os.WriteFile(path, b, 0o777)
}
