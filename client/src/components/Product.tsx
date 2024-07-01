import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProduct } from '../store/reducers/productReducer';

export default function Product() {
  // lấy data về
  const data:any=useSelector(state=>state);
  console.log(1111111111,data);
  // bắn dispatch lên
  const disPatch=useDispatch();
  useEffect(()=>{
    disPatch(getAllProduct());
  },[]);
  return (
    <div className='product-dad'>List Product
    {data.productReducer.product.map((item)=>{
      return (<div className='product'>
        <div><img style={{width:"200px"}} src={item.image} alt="" /></div>
        <div className='product-render'>
          <div>Tên sản phẩm: {item.name}</div>
          <div style={{maxWidth:"250px"}}>{item.description}</div>
          <div>Số lượng: {item.stock}</div>
        </div>
        <div className='product-render'>
          <div><input type="text" /></div>
          <div>Giá: {item.price} $</div>
          <button>Addtocart</button>
        </div>
      </div>)
    })}
    </div>
  )
}
