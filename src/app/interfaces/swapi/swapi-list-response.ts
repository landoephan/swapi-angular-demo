import { Person } from './person'

export interface SwapiListResponse {
	count: number
	next: string
	previous: string
	results: Array<Person>
}
