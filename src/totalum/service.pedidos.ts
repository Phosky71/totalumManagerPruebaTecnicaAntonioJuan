import {totalumSdk} from './totalum.service';

// Interfaces para tipado
export interface Pedido {
  _id?: string; // Campo autogenerado por Totalum
  num_pedido: number;             // Obligatorio - Nuevo campo añadido
  importe_pedido: number;         // Obligatorio
  impuestos_pedido: number;       // Obligatorio
  cantidad_productos: number;     // Obligatorio
  fecha_pedido: string;           // Obligatorio, solo fecha sin hora
  cliente_pedido?: string;        // Opcional
}

// Interfaces para filtros
export interface PedidoFilter {
  num_pedido?: number | Record<string, any>;
  importe_pedido?: number | Record<string, any>;
  impuestos_pedido?: number | Record<string, any>;
  cantidad_productos?: number | Record<string, any>;
  fecha_pedido?: string | Record<string, any>;
  cliente_pedido?: string | Record<string, any>;
}

// Obtener todos los pedidos
export async function getPedidos() {
  try {
    const currentPage = window.currentPedidoPage || 0;
    const response = await totalumSdk.crud.getItems('pedido', {
      sort: {createdAt: 1},
      pagination: {page: currentPage, limit: 5}
    });

    const numPedidos = await totalumSdk.crud.getItems('pedido', {
      sort: {createdAt: 1},
      pagination: {limit: 0}
    });

    return {
      data: response.data,
      total: numPedidos.data.data.length
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      total: 0
    };
  }
}


// Obtener un pedido por ID
export async function getPedido(id: string) {
  try {
    const response = await totalumSdk.crud.getItemById('pedido', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Crear un pedido
export async function createPedido(pedidoData: Omit<Pedido, '_id'>) {
  try {
    // Validamos que tenga los campos obligatorios
    if (
      pedidoData.num_pedido === undefined ||     // Validación para el nuevo campo
      pedidoData.importe_pedido === undefined ||
      pedidoData.impuestos_pedido === undefined ||
      pedidoData.cantidad_productos === undefined ||
      !pedidoData.fecha_pedido
    ) {
      throw new Error('Faltan campos obligatorios: num_pedido, importe_pedido, impuestos_pedido, cantidad_productos y fecha_pedido son requeridos');
    }

    const response = await totalumSdk.crud.createItem('pedido', pedidoData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Editar un pedido por ID
export async function editPedido(id: string, pedidoData: Partial<Omit<Pedido, '_id'>>) {
  try {
    const response = await totalumSdk.crud.editItemById('pedido', id, pedidoData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Filtrar pedidos
export async function getPedidosWithFilter(
  filtros: PedidoFilter,
  sortOptions: Record<string, 1 | -1> = {createdAt: 1},
  paginationOptions: { page: number; limit: number } = {page: 0, limit: 5}
) {
  try {
    const filterArray = Object.entries(filtros).map(([field, value]) => ({
      field,
      operator: typeof value === 'object' ? Object.keys(value)[0] : 'eq',
      value: typeof value === 'object' ? Object.values(value)[0] : value
    }));

    const response = await totalumSdk.crud.getItems('pedido', {
      filter: filterArray,  // Now passing an array
      sort: sortOptions,
      pagination: paginationOptions
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


// Eliminar un pedido
export async function deletePedido(id: string) {
  try {
    const response = await totalumSdk.crud.deleteItemById('pedido', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
