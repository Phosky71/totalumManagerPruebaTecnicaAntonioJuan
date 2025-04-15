import {totalumSdk} from './totalum.service';


// Interfaces para tipado
export interface Cliente {
  _id?: string; // Campo autogenerado por Totalum
  nombre_cliente: string; // Obligatorio
  email_cliente: string;  // Obligatorio
  tlf_cliente: string;    // Obligatorio
  fecha_nac_cliente?: string; // Opcional, solo fecha sin hora
}

// Interfaces para filtros
export interface ClienteFilter {
  nombre_cliente?: string | Record<string, any>;
  email_cliente?: string | Record<string, any>;
  tlf_cliente?: string | Record<string, any>;
  fecha_nac_cliente?: string | Record<string, any>;
}

// Obtener todos los clientes
export async function getClientes() {
  try {
    const response = await totalumSdk.crud.getItems('cliente', {
      sort: {createdAt: 1},
      pagination: {page: 0, limit: 5}
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Obtener un cliente por ID
export async function getCliente(id: string) {
  try {
    const response = await totalumSdk.crud.getItemById('cliente', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Crear un cliente
export async function createCliente(clienteData: Omit<Cliente, '_id'>) {
  try {
    // Validamos que tenga los campos obligatorios
    if (!clienteData.nombre_cliente || !clienteData.email_cliente || !clienteData.tlf_cliente) {
      throw new Error('Faltan campos obligatorios: nombre_cliente, email_cliente y tlf_cliente son requeridos');
    }

    const response = await totalumSdk.crud.createItem('cliente', clienteData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Editar un cliente por ID
export async function editCliente(id: string, clienteData: Partial<Omit<Cliente, '_id'>>) {
  try {
    const response = await totalumSdk.crud.editItemById('cliente', id, clienteData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Filtrar clientes
export async function getClientesWithFilter(
  filtros: ClienteFilter,
  sortOptions: Record<string, 1 | -1> = {createdAt: 1},
  paginationOptions: { page: number; limit: number } = {page: 0, limit: 5}
) {
  try {
    // Convert ClienteFilter object to an array of filter objects
    const filterArray = Object.entries(filtros).map(([field, value]) => ({
      field,
      operator: typeof value === 'object' ? Object.keys(value)[0] : 'eq',
      value: typeof value === 'object' ? Object.values(value)[0] : value
    }));

    const response = await totalumSdk.crud.getItems('cliente', {
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


// Eliminar un cliente
export async function deleteCliente(id: string) {
  try {
    const response = await totalumSdk.crud.deleteItemById('cliente', id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
