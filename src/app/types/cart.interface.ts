export interface ICart {
  name_rus: string;
  img_path: string;
  quantity: string;
  propertiesArray: IProperties[]
}

export interface IProperties {
  size_name: string;
  size: string
}

export interface IPurchases {
  name: string,
  phone: string,
  email: string,
  basket: ICart[]
}
