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
	people$: Observable<Array<Person>> | undefined
	person$: Observable<Person | null> | undefined
	homeworld$: Observable<Planet | null> | undefined
	films$: Observable<Array<Film | null>> | undefined
	activeCard: number = -1
	showPersonLoader: boolean = false

	constructor(private swapiService: SwapiService, private snackBar: MatSnackBar) {}

	private static getRandomSlice(arr: any[], n: number): any[] {
		let result = new Array(n),
			len = arr.length,
			taken = new Array(len)
		if (n > len) throw new RangeError('more elements taken than available')
		while (n--) {
			let x = Math.floor(Math.random() * len)
			result[n] = arr[x in taken ? taken[x] : x]
			taken[x] = --len in taken ? taken[len] : len
		}
		return result
	}

	async ngOnInit() {
		// TODO stop skipping the last page (there are only two people)
		await this.loadPeople(Math.floor(Math.random() * 8) + 1)
	}

	loadPersonDetails(url: string, index: number): void {
		this.activeCard = index
		this.showPersonLoader = true
		// we could show details for a person without loading a person - since it was asked for in the task we will do it with extra loading
		this.person$ = this.swapiService.getPerson(url).pipe(
			tap((response) => {
				this.loadHomeworld(response.homeworld)
				this.loadFilms(response.films)
			}),
			catchError(async (error: any) => {
				console.log(error)
				this.openSnackBar('Error while loading person details. Please try again.')
				return null
			}),
			finalize(() => (this.showPersonLoader = false))
		)
	}

	concatTitles(films: Array<Film | null>) {
		console.log(films)
		return films
			.map((film) => {
				return film?.title
			})
			.join(', ')
	}

	private loadPeople(pageNumber: number): void {
		this.people$ = this.swapiService.getPeople(pageNumber).pipe(
			map((result: SwapiListResponse) => {
				console.log(AppComponent.getRandomSlice(result.results, 3))
				return AppComponent.getRandomSlice(result.results, 3) as Array<Person>
			}),
			catchError((error: any) => {
				console.log(error)
				this.openSnackBar('Error while loading the people. Please try again.')
				return EMPTY
			})
		)
	}

	private loadHomeworld(url: string): void {
		this.homeworld$ = this.swapiService.getHomeworld(url).pipe(
			catchError((error: any) => {
				console.log(error)
				this.openSnackBar('Error while loading the homeworld.')
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
					this.openSnackBar('Error while loading films.')
					return EMPTY
				})
			)
		)
		this.films$ = forkJoin(films$)
	}

	private openSnackBar(message: string, action: string = 'Ok') {
		this.snackBar.open(message, action, {
			duration: 8000,
			panelClass: ['mat-toolbar', 'mat-warn'],
		})
	}
}
