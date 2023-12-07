let productData=[];
let productWrap=document.querySelector('.productWrap');

//初始化fun
function init(){
    getProductList();
}
init();

//取得商品清單
function getProductList(){
    axios.get(`${url}/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
        //console.log(response);
        productData=response.data.products;
        console.log(productData);
        renderProductList();
      })
      .catch(function (error) {
        console.log(error);
      })
}


function renderProductList(){
    let str='';
    productData.forEach(function(item){
        console.log(item);
        str+=`<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
    })
    productWrap.innerHTML=str;
}
