import { Component, Input, Optional, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'inline-edit',
  styleUrls: ['inline-edit.scss'],
  templateUrl: 'inline-edit.html'
})
export class InlineEditComponent {

  /** Overrides the comment and provides a reset value when changes are cancelled. */
  @Input()
  get value(): string { return this._value; }
  set value(x: string) {
    this.val = this._value = x;
  }
  private _value = '';

  @Input('propName') propName: string = '';
  @Input('pipeName') pipeName: string = '';

  /** Form model for the input. */
  val = '';

  constructor(@Optional() @Host() public popover: SatPopover) { }

  ngOnInit() {
    // subscribe to cancellations and reset form value
    if (this.popover) {
      this.popover.closed.pipe(filter(val => val == null))
        .subscribe(() => this.val = this.value || '');
    }
  }

  onSubmit() {
    if (this.popover) {
      this.popover.close(this.val);
    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}