import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getAllProduct } from '../store/reducers/productReducer';

export default function Product() {
    const { products } = useSelector(state => state.productReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    const addToCartNow = (item) => {
        dispatch(addToCart({ ...item, quantity: 1 }));
    };

    return (
        <div className='product-dad'>
            List Product
            {products.map((item) => (
                <div className='product' key={item.id}>
                    <div><img style={{ width: "200px" }} src={item.image} alt="" /></div>
                    <div className='product-render'>
                        <div>Tên sản phẩm: {item.name}</div>
                        <div style={{ maxWidth: "250px" }}>{item.description}</div>
                        <div>Số lượng: {item.stock}</div>
                    </div>
                    <div className='product-render'>
                        <div><input value='1' type="text" readOnly /> </div>
                        <div>Giá: $ {item.price}</div>
                        <button onClick={() => addToCartNow(item)} disabled={item.stock === 0}>Add to cart</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
