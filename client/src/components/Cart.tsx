import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCart, removeFromCart, updateCartQuantity } from '../store/reducers/productReducer';

export default function Cart() {
    const { cart, total } = useSelector(state => state.productReducer);
    const dispatch = useDispatch();
    const [confirmRemove, setConfirmRemove] = useState(null);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    const handleUpdateQuantity = (id, quantity) => {
        dispatch(updateCartQuantity({ id, quantity }));
    };

    const handleRemoveProduct = (id) => {
        setConfirmRemove(id);
    };

    const confirmRemoveProduct = (id) => {
        dispatch(removeFromCart(id));
        setConfirmRemove(null);
    };

    return (
        <div>
            Cart
            {cart.map(item => (
                <div className='product' key={item.id}>
                    <div><img style={{ width: "200px" }} src={item.image} alt="" /></div>
                    <div className='product-render'>
                        <div>Tên sản phẩm: {item.name}</div>
                        <div style={{ maxWidth: "250px" }}>{item.description}</div>
                        <div>Số lượng: <input value={item.quantity} type="number" onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))} /></div>
                    </div>
                    <div className='product-render'>
                        <div>Giá: $ {item.price * item.quantity}</div>
                        <button onClick={() => handleRemoveProduct(item.id)}>Xóa</button>
                    </div>
                </div>
            ))}
            <div>Tổng tiền: $ {total}</div>
            {confirmRemove && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
                        <button onClick={() => confirmRemoveProduct(confirmRemove)}>Xác nhận</button>
                        <button onClick={() => setConfirmRemove(null)}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
}
