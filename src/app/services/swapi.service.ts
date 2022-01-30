import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { Film } from '../interfaces/swapi/film'
import { Person } from '../interfaces/swapi/person'
import { Planet } from '../interfaces/swapi/planet'
import { SwapiListResponse } from '../interfaces/swapi/swapi-list-response'

@Injectable({
	providedIn: 'root',
})
export class SwapiService {
	constructor(private http: HttpClient) {}

	public getPeople(pageNumber: number): Observable<SwapiListResponse> {
		return this.http.get<SwapiListResponse>(`${environment.swapiUrl}/people?page=${pageNumber}`)
	}

	public getPerson(url: string): Observable<Person> {
		return this.http.get<Person>(url)
	}

	public getHomeworld(url: string): Observable<Planet> {
		return this.http.get<Planet>(url)
	}

	public getFilm(url: string): Observable<Film> {
		return this.http.get<Film>(url)
	}
}
