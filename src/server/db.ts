import { getServerClient } from '@/lib/supabase'

export function table<T extends object>(name: string) {
	const supabase = getServerClient()
	return {
		select: (cols: string = '*') => supabase.from<T>(name).select(cols),
		insert: (rows: T | T[]) => supabase.from<T>(name).insert(rows).select('*'),
		update: (values: Partial<T>) => supabase.from<T>(name).update(values),
		remove: () => supabase.from<T>(name).delete()
	}
}
