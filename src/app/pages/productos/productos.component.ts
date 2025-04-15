import {Component, OnInit} from '@angular/core';
import {getProductos, Producto} from '../../../totalum/service.productos';

import {FormsModule} from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    TitleCasePipe,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'precio', 'categoria', 'cantidad'];
  productos: Producto[] = [];
  search = '';
  page = 1;
  pageSize = 3;

  async ngOnInit() {
    const response = await getProductos();
    // Verificar si response es un array o un objeto
    if (response) {
      if (Array.isArray(response)) {
        this.productos = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Si response es un objeto con una propiedad data que es un array
        this.productos = response.data;
      } else if (typeof response === 'object') {
        // Si response es un objeto pero no tiene una propiedad data que sea un array
        // Intentar convertir el objeto en un array
        this.productos = Object.values(response);
      } else {
        this.productos = [];
      }
    } else {
      this.productos = [];
    }
    console.log('Productos cargados:', this.productos);
  }


  get filteredProductos() {
    console.log('Filtrando productos:', this.productos.length);
    const searchLower = this.search.trim().toLowerCase();
    let filtered = this.productos;
    if (searchLower) {
      filtered = filtered.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get allProductos() {
    return this.productos;
  }

  get totalPages() {
    const searchLower = this.search.trim().toLowerCase();
    const filtered = searchLower
      ? this.productos.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      )
      : this.productos;
    return Math.ceil(filtered.length / this.pageSize);
  }

  setPage(newPage: number) {
    this.page = newPage;
  }
}


