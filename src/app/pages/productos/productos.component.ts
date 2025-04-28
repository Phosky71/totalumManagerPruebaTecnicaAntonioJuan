import {Component, OnInit} from '@angular/core';
import {getProductos, Producto} from '../../../totalum/service.productos';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {Cliente, deleteCliente} from '../../../totalum/service.clientes';
import {ConfirmDialogComponent} from '../../components/shared/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    TitleCasePipe,
    NgIf,
    CurrencyPipe,
    MatDialogModule
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

  constructor(private dialog: MatDialog) {}

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

  async eliminarProducto(producto: Producto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar producto',
        message: `¿Estás seguro de que deseas eliminar el producto ${producto.nombre_producto}?`
      }
    });

    try {
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result) {
        if (producto._id) {
          await deleteCliente(producto._id);
          await this.loadProductos();
        }
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  }

  async editarProducto(producto: Producto) {
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
