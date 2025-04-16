import {Component, OnInit} from '@angular/core';
import {Cliente, getClientes} from '../../../totalum/service.clientes';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';


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
  totalItems = 0;

  async ngOnInit() {
    await this.loadClientes();
  }

  async loadClientes() {
    // Actualiza la variable global antes de hacer la llamada
    window.currentClientPage = this.page - 1;

    const response = await getClientes();

    console.log(response);
    console.log(response.data.data);

    // Verificar si response existe
    if (response) {
      // Si response es un array directamente
      if (Array.isArray(response)) {
        console.log("1");
        this.clientes = response.data.data;
        this.totalItems = response.length;
      }
      // Si response tiene la estructura {data: [...], total: number}
      else if (response.data && Array.isArray(response.data)) {
        console.log("2");
        this.clientes = response.data;
        this.totalItems = response.total || response.data.length;
      }
      // Si response es otro tipo de objeto
      else if (typeof response === 'object') {
        console.log("3");
        // Intentar extraer los datos de alguna manera
        this.clientes = response.data.data;
        this.totalItems = response.total || this.clientes.length;
        console.log(this.clientes);
        console.log(this.totalItems);
      } else {
        console.log("4");
        this.clientes = [];
        this.totalItems = 0;
      }
    } else {
      console.log("5");
      this.clientes = [];
      this.totalItems = 0;
    }

    console.log('Clientes cargados:', this.clientes);
    console.log('Total de clientes:', this.totalItems);
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
    return filtered;
  }

  get allClientes() {
    return this.clientes;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  async setPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      window.currentClientPage = newPage - 1;
      await this.loadClientes();
    }
  }


}
