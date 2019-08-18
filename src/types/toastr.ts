export interface ToastrOptions {
  message: string,
  delay?: number,
}

export interface ToastrItem extends ToastrOptions {
  id: string,
  delay: number,
}
