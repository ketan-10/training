package utils

func Filter[T any](list []T, filter func(item T) bool) []T {
	var newList []T
	for _, v := range list {
		if filter(v) {
			newList = append(newList, v)
		}
	}
	return newList
}
