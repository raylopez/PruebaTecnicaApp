import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faFileLines, faUser } from '@fortawesome/free-solid-svg-icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompanyData } from '@services';
import { Company } from '@models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly companyService = inject(CompanyData);
  public companies = toSignal<Company[]>(this.companyService.getCompanies(), { initialValue: undefined });
  faUser = faUser;
  faFileLines = faFileLines;
}
