import {totalumSdk} from './totalum.service';
import {ISearchQueryFilterOptions} from 'totalum-api-sdk';

// Interfaces para tipado
export interface Producto {
  _id?: string; // Campo autogenerado por Totalum
  nombre_producto: string; // Obligatorio, texto normal, repetible
  precio_producto: number; // Obligatorio, número, 2 decimales, repetible
  categoria_producto?: string; // Opcional, texto normal, repetible
  cantidad_producto?: number; // Opcional, número entero, repetible
}

// Interfaces para filtros
export interface ProductoFilter {
  nombre_producto?: string | Record<string, any>;
  precio_producto?: number | Record<string, any>;
  categoria_producto?: string | Record<string, any>;
  cantidad_producto?: number | Record<string, any>;
}

// Obtener todos los productos
export async function getProductos() {
  try {
    const currentPage = window.currentProductPage || 0;
    const response = await totalumSdk.crud.getItems('producto', {
      sort: {createdAt: 1},
      pagination: {page: currentPage, limit: 5}
    });

    const numProductos = await totalumSdk.crud.getItems('producto', {
      sort: {createdAt: 1},
      pagination: {limit: 0}
    });

    return {
      data: response.data,
      total: numProductos.data.data.length
    };
  } catch (error) {
    console.error('Error en getProductos:', error);
    return {
      data: [],
      total: 0
    };
  }
}



// Obtener un producto por ID
export async function getProducto(id: string) {
  try {
    const response = await totalumSdk.crud.getItemById('producto', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Crear un producto
export async function createProducto(productoData: Omit<Producto, '_id'>) {
  try {
    // Validamos que tenga los campos obligatorios
    if (
      !productoData.nombre_producto ||
      productoData.precio_producto === undefined
    ) {
      throw new Error('Faltan campos obligatorios: nombre_producto y precio_producto son requeridos');
    }
    const response = await totalumSdk.crud.createItem('producto', productoData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Editar un producto por ID
export async function editProducto(id: string, productoData: Partial<Omit<Producto, '_id'>>) {
  try {
    const response = await totalumSdk.crud.editItemById('producto', id, productoData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Filtrar productos
export async function getProductosWithFilter(
  filtros: ProductoFilter,
  sortOptions: Record<string, 1 | -1> = {createdAt: 1},
  paginationOptions: { page: number; limit: number } = {page: 0, limit: 5}
): Promise<Producto[] | undefined> {
  try {
    // Construye el array de filtros
    const filterArray: ISearchQueryFilterOptions[] = Object.entries(filtros).map(([field, value]) => ({
      field,
      operator: typeof value === 'object' ? Object.keys(value)[0] : 'eq',
      value: typeof value === 'object' ? Object.values(value)[0] : value,
    }));

    const response = await totalumSdk.crud.getItems('producto', {
      filter: filterArray,
      sort: sortOptions,
      pagination: paginationOptions
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}


// Eliminar un producto
export async function deleteProducto(id: string) {
  try {
    const response = await totalumSdk.crud.deleteItemById('producto', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
