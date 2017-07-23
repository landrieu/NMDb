export class Movie {
  constructor(
    public _id: string,
    public title: string,
    public director: string,
    public actors: string,
    public location: string,
    public releaseDate : string,
    public budget: string,
    public poster: string,
    public plot : string,
    public metascore: number,
    public imdbId: string
  ) {  }
}