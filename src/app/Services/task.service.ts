import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Task} from '../Model/Task';
import { Observable, Subject, catchError, map, throwError} from 'rxjs';
import { LoggingService } from './logging-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http: HttpClient = inject(HttpClient)
  loggingService: LoggingService =inject(LoggingService)
  errorSubject = new Subject<HttpErrorResponse>();
  allTasks: Task[] = [];

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ 'my-header': 'JR world' });
    this.http.post<{ name: string }>('https://angularhttpclientsss-a330a-default-rtdb.firebaseio.com/tasks.json', task, { headers: headers })
      .subscribe({error:(err)=>{
        this.errorSubject.next(err)
      } });
  }

  DeleteTask(id: string | undefined) {
    this.http.delete('https://angularhttpclient-a330a-default-rtdb.firebaseio.com/tasks/' + id + '.json')
      .subscribe({error:(err)=>{
        this.errorSubject.next(err)
      } });
  }

  DeleteAllTasks() {
    this.http.delete('https://angularhttpclient-a330a-default-rtdb.firebaseio.com/tasks.json')
      .subscribe({error:(err)=>{
        this.errorSubject.next(err)
      } })
  }

  GetAlltasks() {
    return this.http.get<{ [key: string]: Task }>('https://angularhttpclient-a330a-default-rtdb.firebaseio.com/tasks.json')
      .pipe(map((response) => {
        //Transform Data
        let tasks = [];

        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            tasks.push({ ...response[key], id: key })
          }
        }

        return tasks;


      }), catchError((err)=> {
        //Write the logic to log errors
        const errorObj = {statusCode:err.status,errorMessage:err.message, datetime:new Date}
        this.loggingService.logError(errorObj);
        return throwError(()=> err);
      }))

  }

  UpdateTask(id:string | undefined,data:Task){
    this.http.put('https://angularhttpclient-a330a-default-rtdb.firebaseio.com/tasks/'+id+'.json',data)
    .subscribe({error:(err)=>{
      this.errorSubject.next(err)
    } });
  }

  getTaskDetails(id: string | undefined): Observable<any>{
    return this.http.get('https://angularhttpclient-a330a-default-rtdb.firebaseio.com/tasks/'+id+'.json')
    .pipe(map((response)=>{
      console.log(response)
      let task ={};
      task={...response,id:id}
      return task;
    }))
    
  }



  constructor() { }
}
