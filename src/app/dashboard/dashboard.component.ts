import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { ImplicitReceiver } from '@angular/compiler';
import { Subscription, map } from 'rxjs';
import { TaskService } from '../Services/task.service';
import { error } from 'node:console';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  http: HttpClient = inject(HttpClient)
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService)
  currentTaskId: string | undefined = '';
  isLoading: boolean = false;

  currentTask: Task | null = null;

  errorMessage: string | null = null;
  editMode: boolean = false;
  selectedTask!: Task;

  errorSub!: Subscription;

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      }
    })
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = { title: '', desc: '', assignedTo: '', createdAt: '', priority: '', status: '' }
  }

  showCurrentTaskDetails(id: string | undefined){
    this.showTaskDetails=true;
    this.taskService.getTaskDetails(id)
    .subscribe({next: (data: Task) => {
      this.currentTask=data;
    }})
    
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CloseTaskDetails(){
    this.showTaskDetails=false;
  }



  CreateOrUpdateTask(data: Task) {
    if (!this.editMode)
      this.taskService.CreateTask(data);
    else
      //  edit Task
      this.taskService.UpdateTask(this.currentTaskId, data);
  }

  FetchAllTaskClicked() {
    this.fetchAllTasks()

  }

  private fetchAllTasks() {
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      }, error: (error) => {
        // this.errorMessage=error.message;
        this.setErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    // console.log(err);
    if (err.error.error === 'Permission denied') {
      this.errorMessage = 'You do not have permission to perform this action';
    }
    else {
      this.errorMessage = err.message;
    }
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000)
  }

  DeleteTask(id: string | undefined) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.DeleteTask(id);
    }
  }

  DeleteAllTaskClicked() {
    if (confirm('Are you sure you want to clear all task?')) {
      this.taskService.DeleteAllTasks();
    }

  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;
    //Edit Form
    this.showCreateTaskForm = true; 
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) =>
      task.id === id) as Task;

  }
 
  
}
