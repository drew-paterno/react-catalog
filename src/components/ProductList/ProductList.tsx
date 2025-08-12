import { type ProductType } from '../../assets/products';
import Product from '../Product/Product';
import './ProductList.css'
import { useCallback, useEffect, useMemo, useState } from 'react';

const isInList = (list: ProductType[], product: ProductType) => list.some(p => p.id === product.id);

const getWishlistHelperText = (length: number) => {
    if(length == 1) {
        return 'There is currently 1 item in your wishlist';
    }
    return `There ${(length === 1 ? 'is' : 'are')} currently ${length} item${(length === 1 ? '' : 's')} in your wishlist`;
};

const comparators = {
    none: { func: () => 0, description: 'None' },
    priceLowHigh: { func: (a: ProductType, b: ProductType) => a.price - b.price, description: 'Price: Low to High' },
    priceHighLow: { func: (a: ProductType, b: ProductType) => b.price - a.price, description: 'Price: High to Low' },
    alphabetical: {
        func: (a: ProductType, b: ProductType) => a.title.localeCompare(b.title),
        description: 'Alphabetical'
    },
};
type ComparatorType = keyof typeof comparators;

const ProductList = () => {
    const [products, setProducts] = useState<ProductType[]>([])
    const [status, setStatus] = useState<'LOADING' | 'LOADED' | 'FAILED'>('LOADING')
    const [wishlist, setWishlist] = useState<ProductType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortingComparator, setSortingComparator] = useState<ComparatorType>('none')

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

    const categories = useMemo(() => products.reduce<string[]>(
        (prev, curr) => !prev.some(
            c => c === curr.category) ? [...prev, curr.category] : prev,
            []
        ).sort(),
        [products]
    )

    const renderedProducts = useMemo(
        () => products
            .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
            .slice().sort(comparators[sortingComparator].func)
        ,
        [products, selectedCategory, sortingComparator]
    )

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
                    <div className="filter">
                        <h4>Filter by Category:</h4>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value='All'>All</option>
                            {categories.map((c, i) => <option value={c} key={i}>{c}</option>)}
                        </select>
                    </div>
                    <div className="sort">
                        <h4>Sort</h4>
                        <select
                            value={sortingComparator}
                            onChange={(e) => setSortingComparator(e.target.value as ComparatorType)}
                        >
                            {(Object.keys(comparators) as ComparatorType[]).map((k, i) => (
                                <option value={k} key={i}>{comparators[k].description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="product-list">
                        {renderedProducts.map(p =>
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