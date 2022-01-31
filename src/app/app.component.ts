import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { catchError, EMPTY, finalize, forkJoin, Observable, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { Film } from './interfaces/swapi/film'
import { Person } from './interfaces/swapi/person'
import { Planet } from './interfaces/swapi/planet'
import { SwapiListResponse } from './interfaces/swapi/swapi-list-response'
import { SwapiService } from './services/swapi.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
	private static MAX_PAGE_SIZE = 8
	private static PEOPLE_COUNT = 3

	people$: Observable<Array<Person>> | undefined
	person$: Observable<Person | null> | undefined
	homeworld$: Observable<Planet | null> | undefined
	films$: Observable<Array<Film | null>> | undefined
	activeCard: number = -1
	showPersonLoader: boolean = false
	random: boolean = false
	search: string = ''

	constructor(private swapiService: SwapiService, private snackBar: MatSnackBar) {}

	private static getRandomPeople(arr: any[], peopleCount: number): any[] {
		let result = new Array(peopleCount),
			len = arr.length,
			taken = new Array(len)
		if (peopleCount > len) throw new RangeError('more people taken than available')
		while (peopleCount--) {
			let x = Math.floor(Math.random() * len)
			result[peopleCount] = arr[x in taken ? taken[x] : x]
			taken[x] = --len in taken ? taken[len] : len
		}
		return result
	}

	private static getRandomPageNumber() {
		return Math.floor(Math.random() * this.MAX_PAGE_SIZE) + 1
	}

	async ngOnInit() {
		await this.loadPeople()
	}

	loadPersonDetails(url: string, index: number): void {
		this.activeCard = index
		this.showPersonLoader = true
		// we could show details for a person without loading a person - since it was asked for in the task we will do it
		// with extra loading
		this.person$ = this.swapiService.getPerson(url).pipe(
			tap((response) => {
				this.loadHomeworld(response.homeworld)
				this.loadFilms(response.films)
			}),
			catchError(async (error: any) => {
				console.log(error)
				this.showError('Error while loading person details. Please try again.')
				return null
			}),
			finalize(() => (this.showPersonLoader = false))
		)
	}

	concatTitles(films: Array<Film | null>): string {
		return films
			.map((film) => {
				return film?.title
			})
			.join(', ')
	}

	changeRandom(): void {
		this.search = ''
		this.resetPersonState()
		this.loadPeople()
	}

	handleSearchInput(): void {
		this.resetPersonState()
		// load initial set of people when search field is empty
		this.search ? this.searchPeople() : this.loadPeople()
	}

	private resetPersonState() {
		this.activeCard = -1
		this.person$ = undefined
	}

	private loadPeople(): void {
		// TODO stop skipping the last page (there are only two people)
		const pageNumber = this.random ? AppComponent.getRandomPageNumber() : 1
		this.people$ = this.swapiService.getPeople(pageNumber).pipe(
			map((result: SwapiListResponse) => {
				return this.random
					? AppComponent.getRandomPeople(result.results, AppComponent.PEOPLE_COUNT)
					: result.results.slice(0, AppComponent.PEOPLE_COUNT)
			}),
			catchError((error: any) => {
				console.log(error)
				this.showError('Error while loading the people. Please try again.')
				return EMPTY
			})
		)
	}

	private searchPeople(): void {
		// TODO add pagination
		this.people$ = this.swapiService.getPeopleByName(this.search).pipe(
			map((result: SwapiListResponse) => {
				return result.results
			}),
			catchError((error: any) => {
				console.log(error)
				this.showError('Error while searching people. Please try again.')
				return EMPTY
			})
		)
	}

	private loadHomeworld(url: string): void {
		this.homeworld$ = this.swapiService.getHomeworld(url).pipe(
			catchError((error: any) => {
				console.log(error)
				this.showError('Error while loading the homeworld.')
				return EMPTY
			})
		)
	}

	private loadFilms(urls: Array<string>): void {
		// combine observers emitted by get single film from swapi
		const films$: Observable<Film | null>[] = urls.map((url) =>
			this.swapiService.getFilm(url).pipe(
				catchError((error: any) => {
					console.log(error)
					this.showError('Error while loading films.')
					return EMPTY
				})
			)
		)
		this.films$ = forkJoin(films$)
	}

	private showError(message: string, action: string = 'Ok') {
		this.snackBar.open(message, action, {
			duration: 8000,
			panelClass: ['mat-toolbar', 'mat-warn'],
		})
	}
}
