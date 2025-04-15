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

  async ngOnInit() {
    this.pedidos = await getPedidos() || [];
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
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    const searchLower = this.search.trim().toLowerCase();
    const filtered = searchLower
      ? this.pedidos.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchLower)
        )
      )
      : this.pedidos;
    return Math.ceil(filtered.length / this.pageSize);
  }

  setPage(newPage: number) {
    this.page = newPage;
  }
}
