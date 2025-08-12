
export type ProductType = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}
export const products: ProductType[] = [
  { id: 1, title: "Essence Mascara Lash Princess", description: "Volumizing mascara", price: 9.99, category: "beauty", image: "https://i.dummyjson.com/data/products/1/thumbnail.jpg" },
  { id: 2, title: "Samsung Galaxy Watch 4", description: "Smartwatch with fitness tracking", price: 199.99, category: "wearables", image: "https://i.dummyjson.com/data/products/2/thumbnail.jpg" },
  { id: 3, title: "Sony Headphones", description: "Noise cancelling over-ear headphones", price: 299.99, category: "electronics", image: "https://i.dummyjson.com/data/products/3/thumbnail.jpg" },
  { id: 4, title: "Wooden Chair", description: "Solid wood dining chair", price: 59.99, category: "furniture", image: "https://i.dummyjson.com/data/products/4/thumbnail.jpg" },
];