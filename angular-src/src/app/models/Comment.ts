 
export class Comment{
  constructor(
    public _id: string,
    public title: string,
    public text: string,
    public username: string,
    public idUser: string,
    public idMovie: string,
    public titleMovie: string,
    public date: Date
  ) {  }
}


