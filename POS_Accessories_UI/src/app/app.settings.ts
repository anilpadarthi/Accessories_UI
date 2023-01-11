import { Injectable } from '@angular/core';

export class Settings {
    constructor(public name: string,
                public theme: string,
                public rtl: boolean,
                public adminSidenavIsOpened: boolean,
                public adminSidenavIsPinned: boolean,
                public adminSidenavUserBlock: boolean,
                public mainToolbarFixed: boolean) { }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'Emporium',  // theme name
        'green',     // green, blue, red, pink, purple, grey
        false,       // true = rtl, false = ltr
        true,        // adminSidenavIsOpened
        true,        // adminSidenavIsPinned 
        true,        // adminSidenavUserBlock 
        false        // mainToolbarFixed
    )
}