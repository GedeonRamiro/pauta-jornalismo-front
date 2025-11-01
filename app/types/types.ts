export interface IPauta {
  id: string;
  name: string;
  infomation: string;
  createdAt: string;
}

export interface IUser {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  typeUser: number;
}

export interface IVehicle {
  id: string;
  model: string;
  manufacturer: string;
  plate: string;
  color: string;
}

export interface ICamera {
  id: string;
  name: string;
  identifierNumber: number;
}

export interface IOffice {
  id: string;
  name: string;
}

export interface IPagination {
  count: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
