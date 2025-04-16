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
  totalItems = 0;

  async ngOnInit() {
    await this.loadProductos();
  }

  async loadProductos() {
    window.currentProductPage = this.page - 1;
    const response = await getProductos();

    // Verificar si response existe
    if (response) {
      if (response.data && Array.isArray(response.data.data)) {
        this.productos = response.data.data;
        this.totalItems = response.total || 0;
      } else {
        this.productos = [];
        this.totalItems = 0;
      }
    } else {
      this.productos = [];
      this.totalItems = 0;
    }

    console.log('Productos cargados:', this.productos);
    console.log('Total de productos:', this.totalItems);
  }

  get filteredProductos() {
    const searchLower = this.search.trim().toLowerCase();
    let filtered = this.productos;
    if (searchLower) {
      filtered = filtered.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
    return filtered;
  }

  get allProductos() {
    return this.productos;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  async setPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      window.currentProductPage = newPage - 1;
      await this.loadProductos();
    }
  }
}
