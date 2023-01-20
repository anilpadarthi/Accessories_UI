import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/app.models';
import { environment } from 'src/environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:7159/api/Category'; 

  getCategoryList(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url+'/GetPagedCategories');
  }

   getCategory(id:number): Observable<Category> {
     return this.http.get<Category>(this.url+'/GetById?id='+id);
   }

  addCategory(category:Category){	
    return this.http.post(this.url +'/Create', category);
  }

  updateCategory(category:Category){
    return this.http.put(this.url +'/Update', category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.url + "/Delete" + id);
  }
  
}
