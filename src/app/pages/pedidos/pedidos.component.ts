import {Component, OnInit} from '@angular/core';
import {deletePedido, editPedido, getPedidos, Pedido} from '../../../totalum/service.pedidos';
import {CurrencyPipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from '../../components/shared/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CurrencyPipe,
    TitleCasePipe,
    NgForOf,
    NgIf,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  displayedColumns: string[] = ['num_pedido', 'importe', 'impuestos', 'cantidad', 'fecha', 'cliente'];
  pedidos: Pedido[] = [];
  search = '';
  page = 1;
  pageSize = 3;
  totalItems = 0;
  pedidoEnEdicion: Pedido | null = null;

  // Inyectar MatDialog en el constructor
  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    await this.loadPedidos();
  }

  async loadPedidos() {
    // Actualiza la variable global antes de hacer la llamada
    window.currentPedidoPage = this.page - 1;
    const response = await getPedidos();

    // Verificar si response existe
    if (response) {
      if (response.data && Array.isArray(response.data.data)) {
        this.pedidos = response.data.data;
        this.totalItems = response.total || 0;
      } else {
        this.pedidos = [];
        this.totalItems = 0;
      }
    } else {
      this.pedidos = [];
      this.totalItems = 0;
    }

    console.log('Pedidos cargados:', this.pedidos);
    console.log('Total de pedidos:', this.totalItems);
  }

  get filteredPedidos() {
    const searchLower = this.search.trim().toLowerCase();
    let filtered = this.pedidos;
    if (searchLower) {
      filtered = filtered.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }
    return filtered;
  }

  // Función para editar un pedido
  async editarPedido(pedido: Pedido) {
    this.pedidoEnEdicion = {...pedido};
    // Aquí puedes implementar la lógica para mostrar un formulario de edición
    // Por ejemplo, abrir un modal o navegar a otra página
    console.log('Editando pedido:', pedido);
  }

  // Función para eliminar un pedido
  async eliminarPedido(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar pedido',
        message: `¿Estás seguro de que deseas eliminar el pedido ${pedido.num_pedido}?`
      }
    });

    // Modificado para usar firstValueFrom en lugar de toPromise (que está obsoleto)
    try {
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result) {
        if (pedido._id) {
          await deletePedido(pedido._id);
          await this.loadPedidos();
        }
      }
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  }

  // Función para guardar los cambios de un pedido en edición
  async guardarCambiosPedido() {
    if (this.pedidoEnEdicion && this.pedidoEnEdicion._id) {
      try {
        // Omitir el _id al enviar los datos para editar
        const {_id, ...datosParaEditar} = this.pedidoEnEdicion;
        await editPedido(_id, datosParaEditar);
        this.pedidoEnEdicion = null;
        await this.loadPedidos(); // Recargar los pedidos después de editar
        console.log('Pedido actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el pedido:', error);
      }
    }
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  async setPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      window.currentPedidoPage = newPage - 1;
      await this.loadPedidos();
    }
  }
}
