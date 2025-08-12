import './Product.css'
import type { ProductType } from '../../assets/products';

type ProductProps = {
    product: ProductType
    onToggleWishlist: () => void;
    inWishlist: boolean
}

const Product = ({ product, onToggleWishlist, inWishlist }: ProductProps) => {

    return (
        <div className="product">
            <h3>{product.title}</h3>
            <img src={product.image} alt={`${product.title} Image`} />
            <div className="price">
                ${product.price.toFixed(2)}
                <button onClick={onToggleWishlist}>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</button>
            </div>
        </div>
    )
}

export default Product