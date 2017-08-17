import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import {AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router){

    }

    /*
    *  Check if the user is the Admin
    */
    canActivate(){
        if(this.authService.isAdmin()){
            return true;
        }else{
            this.router.navigate(['']);
            return false;
        }
    }
}