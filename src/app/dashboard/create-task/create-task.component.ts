import { Component, Output, EventEmitter, output, importProvidersFrom, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../Model/Task';

// import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  @Input() isEditMode: boolean=false;

  @Input() selectedTask!: Task ;

  @ViewChild('taskForm') taskForm!:NgForm;

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit(){
    setTimeout(()=>{
      // if (this.taskForm && this.selectedTask) {
      console.log(this.taskForm.value)
      this.taskForm.form.patchValue(this.selectedTask);
      // }
    },700);
    
  }

  OnCloseForm() {
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form: NgForm){
    this.EmitTaskData.emit(form.value);
    // console.log(form.value);
    this.CloseForm.emit(false);
  }

  
}
