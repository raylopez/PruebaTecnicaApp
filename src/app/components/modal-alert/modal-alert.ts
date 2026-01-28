import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
  selector: 'app-modal-alert',
  imports: [],
  templateUrl: './modal-alert.html',
  styleUrl: './modal-alert.css',
})
export class ModalAlert {
  activeModal = inject(NgbActiveModal);
  @Input() message: string = '';
  @Input() okButtonText: string = 'Ok';
}
