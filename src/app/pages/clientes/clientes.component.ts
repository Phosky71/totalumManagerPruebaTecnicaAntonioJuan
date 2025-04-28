import {Component, OnInit} from '@angular/core';
import {Cliente, deleteCliente, getClientes} from '../../../totalum/service.clientes';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {deletePedido, Pedido} from '../../../totalum/service.pedidos';
import {ConfirmDialogComponent} from '../../components/shared/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,
    NgForOf,
    NgIf,
    MatDialogModule
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

  constructor(private dialog: MatDialog) {}

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

  async eliminarCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar pedido',
        message: `¿Estás seguro de que deseas eliminar el cliente ${cliente.nombre_cliente}?`
      }
    });

    try {
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result) {
        if (cliente._id) {
          await deleteCliente(cliente._id);
          await this.loadClientes();
        }
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  }

  async editarCliente(cliente: Cliente) {
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
