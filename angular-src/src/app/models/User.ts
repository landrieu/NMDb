export class User {
  constructor(
    public _id: string,
    public name: String,
    public email: String,
    public username: String,
    public password:String,
    public registrationDate: Date,
    public birthDate: Date,
    public likedMovies: Array<{
        id: String,
        title: String
    }>,
    public ratedMovies: Array<Object>,
    public placesSeen: Array<Object>,
    public placesToSee: Array<Object>,
    public description: String,
    public lastConnection: Date
  ) {  }
}