import { Component, inject, OnInit, signal } from '@angular/core';
import { CompanyData } from '../../services/company-data';
import { type Company as CompanyModel } from '../../models/company';
import { RouterLink } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faFileLines, faUser } from '@fortawesome/free-solid-svg-icons';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly companyService = inject(CompanyData);
  public companies = toSignal<CompanyModel[]>(this.companyService.getCompanies(), { initialValue: undefined });
  faUser = faUser;
  faFileLines = faFileLines;
}
