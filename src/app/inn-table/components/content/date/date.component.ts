import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'inn-date',
  imports: [],
  template: `
    {{value}}
  `,
  styles: ``
})
export class DateComponent implements OnInit {
  @Input() value: any;

  ngOnInit(): void {
    this.value = new Date(this.value).toLocaleDateString('en-US');
  }

}
