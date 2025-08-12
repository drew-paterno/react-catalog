import { type ProductType } from '../../assets/products';
import Product from '../Product/Product';
import './ProductList.css'
import { useCallback, useEffect, useState } from 'react';

const isInList = (list: ProductType[], product: ProductType) => list.some(p => p.id === product.id);

const getWishlistHelperText = (length: number) => {
    if(length == 1) {
        return 'There is currently 1 item in your wishlist';
    }
    return `There ${(length === 1 ? 'is' : 'are')} currently ${length} item${(length === 1 ? '' : 's')} in your wishlist`;
};

const ProductList = () => {
    const [products, setProducts] = useState<ProductType[]>([])
    const [status, setStatus] = useState<'LOADING' | 'LOADED' | 'FAILED'>('LOADING')
    const [wishlist, setWishlist] = useState<ProductType[]>([])

    const toggle = (product: ProductType) => {
        setWishlist(prev =>
            isInList(prev, product)
                ? prev.filter(p => p.id !== product.id)
                : [...prev, product]
        )
    }

    const fetchData = useCallback(async () => {
        setStatus('LOADING')
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            setProducts(await response.json())
            setStatus('LOADED')
        } catch {
            setStatus('FAILED')
        }
    }, [])

    useEffect(() => {
        void fetchData()
    }, [fetchData]);

    return (
        <div className="product-list-container">
            <h1>Product Catalog</h1>
            {status === 'LOADING' && (
                <h3>Loading...</h3>
            )}
            {status === 'FAILED' && (
                <>
                    <h3>Failed to Load Products</h3>
                    <button onClick={fetchData}>Try Again</button>
                </>
            )}
            {status === 'LOADED' && (
                <>
                    <h3>{getWishlistHelperText(wishlist.length)}</h3>
                    <div className="product-list">
                        {products.map(p =>
                            <Product
                                key={p.id}
                                product={p}
                                onToggleWishlist={() => toggle(p)}
                                inWishlist={isInList(wishlist, p)}
                            />)
                        }
                    </div>
                </>
            )}
        </div>
    )

}

export default ProductList;