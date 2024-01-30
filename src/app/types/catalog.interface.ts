interface IGeneral {
  img_path: string;
  name: string;
  name_rus: string;
  type: string
}


export interface ICatalog extends IGeneral {
  contains: IContains[]
}

export interface IContains {
  img_path: string;
  name: string;
  name_rus: string
}
export interface IItem extends IGeneral {
  sizes: ISizes[]
}

export interface ISizes {
  size_name: string;
  contain_sizes: string[]
}
