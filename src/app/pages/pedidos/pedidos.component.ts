import { Component, OnInit } from '@angular/core';
import { getPedidos, Pedido } from '../../../totalum/service.pedidos';
import { CurrencyPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CurrencyPipe,
    TitleCasePipe,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  displayedColumns: string[] = ['num_pedido','importe', 'impuestos', 'cantidad', 'fecha', 'cliente'];
  pedidos: Pedido[] = [];
  search = '';
  page = 1;
  pageSize = 3;
  totalItems = 0;

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

  get allPedidos() {
    return this.pedidos;
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

