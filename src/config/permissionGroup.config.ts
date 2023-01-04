import { Permission } from 'src/modules/auth/permission.enum';

export enum PermissionGroupKeys {
  roles,
  users,
}

export default [
  // --------------------------------------------------------------------------
  // ROLES PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: 1,
    name: 'Roles',
    description:
      'Permisos para la adminsitración de los roles de la paltaforma',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_ROLE,
      },
      // READ
      {
        id: 2,
        name: 'Ver',
        key: Permission.READ_ROLE,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_ROLE,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.CREATE_ROLE,
      },
      // ADD ROLE TO USER
      {
        id: 5,
        name: 'Asignar rol a usuario',
        key: Permission.ADD_ROLE_TO_USER,
      },
      // REMOVE ROL TO USER
      {
        id: 6,
        name: 'Remover Rol a usuario',
        key: Permission.REMOVE_ROLE_TO_USER,
      },
      // UPDATE ROLE PERMISSION
      {
        id: 7,
        name: 'Actualizar los permisos',
        key: Permission.UPDATE_ROLE_PERMISSIONS,
      },
    ],
  },
  // --------------------------------------------------------------------------
  // USER PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: 2,
    name: 'Usuarios',
    description: 'Permisos para la adminsitración de los usuarios',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_NEW_USER,
      },
      // READ
      {
        id: 2,
        name: 'Ver Usuarios',
        key: Permission.READ_USERS,
      },
      {
        id: 2,
        name: 'Ver Usuario',
        key: Permission.READ_USER,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_USER,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.DELETE_USER,
      },
    ],
  },
  // --------------------------------------------------------------------------
  // ROLES PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: 3,
    name: 'Clientes',
    description:
      'Permisos para la adminsitración de los clientes de la paltaforma',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_NEW_CUSTOMER,
      },
      // READ
      {
        id: 2,
        name: 'Ver',
        key: Permission.READ_CUSTOMER,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_CUSTOMER,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.DELETE_CUSTOMER,
      },
    ],
  },
];
