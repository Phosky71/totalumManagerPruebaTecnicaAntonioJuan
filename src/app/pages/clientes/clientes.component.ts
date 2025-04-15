import { Component, OnInit } from '@angular/core';
import { getClientes, Cliente } from '../../../totalum/service.clientes';

import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'fechaNacimiento', 'email', 'telefono'];
  clientes: Cliente[] = [];
  search = '';
  page = 1;
  pageSize = 3;

  async ngOnInit() {
    this.clientes = await getClientes() || [];
  }

  get filteredClientes() {
    const searchLower = this.search.trim().toLowerCase();
    let filtered = this.clientes;
    if (searchLower) {
      filtered = filtered.filter(c =>
        Object.values(c).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    const searchLower = this.search.trim().toLowerCase();
    const filtered = searchLower
      ? this.clientes.filter(c =>
        Object.values(c).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      )
      : this.clientes;
    return Math.ceil(filtered.length / this.pageSize);
  }

  setPage(newPage: number) {
    this.page = newPage;
  }
}
