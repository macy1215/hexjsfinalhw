let productData=[];
let productList=document.querySelector('.productWrap');


//初始化fun
function init(){
    getProductList();
    getCartList();
}
init();

//取得商品清單
function getProductList(){
    axios.get(`${url}/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
        //console.log(response);
        productData=response.data.products;
        // console.log(productData);
        renderProductList();
      })
      .catch(function (error) {
        console.log(error);
      })
}

//重複地方都會使用，因為跟以下的函示有關係，所以需要帶到參數。
function combineProductHTMLItem(item){
    return `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}">
                <a href="#" id="addCardBtn" class='js-addCart' data-id='${item.id}'>加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
};

function renderProductList(){
    let str='';
    productData.forEach(function(item){
        //console.log(item);
        //渲染因為有分別不同功能，所以會切換不同的頁面，所以將內容另外寫
        str+= combineProductHTMLItem(item);
    })
    productList.innerHTML=str;
}

//console.log(productData);
//下拉選單切換顯示 監聽change的流程
let productSelect = document.querySelector('.productSelect');
productSelect.addEventListener('change',function(e){
    //console.log(e.target.value); -> 為了檢查他點擊後會顯示的值
    const category = e.target.value;
    if(category == '全部'){
        renderProductList();
        return
    }
    let str='';
    //依照不同的選擇文字顯示對應的li
    //console.log(productData);
    productData.forEach(function(item,index){
        if(item.category == category){
            str+= combineProductHTMLItem(item);
        }
    })
    productWrap.innerHTML=str;
})

//const addCardBtn=document.querySelector('.addCardBtn');
//從外層綁監聽 就不用一顆一顆綁
productList.addEventListener('click',function(e){
    //回覆他的初始值，因為點加入購物車有預設 a #
    e.preventDefault();
    // console.log(e.target.getAttribute('data-id'));
    // productData.forEach(function(item,index){
    //     //if()
    // });
    let addCartClass=e.target.getAttribute('class');
    if(addCartClass !== "js-addCart"){
        return;
    }
    let productID=e.target.getAttribute('data-id');//紀錄產品的id
    console.log(productID);
    //加入購物車功能
    let numCheck =1; //預設一筆資料
    cartData.forEach(function(item){
        if(item.product.id===productID){//雌料庫的id與紀錄產品的id是否相同
            //有一樣的品項
            numCheck=item.quantity+=1;
        }//沒有的話就傳1給他
        //post
    })
    //console.log(numCheck); 確認典籍按鈕有新增數量到指定產品
    axios.post(`${url}/api/livejs/v1/customer/${api_path}/carts`,{
            "data": {
              "productId":productID,
              "quantity": numCheck
            }
    })
    .then(function(response){
        console.log(response);
        getCartList();
        alert('加入購物車');
    })
});

let cartData=[];
const cartList = document.querySelector('.shoppingCart-tableList');//公用變數
//顯示購物車清單
function getCartList(){
    axios.get(`${url}/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        cartData=response.data.carts;
        //可以新增一個如果購物車無資料可顯示甚麼<可以依照資料長度=0時
        let str='';
        console.log(response.data.finalTotal);
        //總計核算的寫法，如果後端有寫就用後端的
        document.querySelector('.js-total').textContent=response.data.finalTotal
        cartData.forEach(function(item){   
            str+=`<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id='${item.id}'>
                            clear
                        </a>
                    </td>
                  </tr>`
        });
        //購物車id不是商品 id
        cartList.innerHTML=str;//這邊不是+=
    })
        .catch(function (error) {
            console.log(error);
        })
}

//刪除單一資料
cartList.addEventListener('click',function(e){
    e.preventDefault();//取消預錄型為
    const cartId =e.target.getAttribute('data-id');
    //取得data購物車id
    if(cartId==null){
        alert('你點到其他東西了')//點到非刪除按鈕時會顯示
        return;
    }
    console.log(cartId);
    axios.delete(`${url}/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(response){
        alert('成功刪除單筆資料');
        getCartList();
    })
    .catch(function (error) {
        console.log(error);
    })
});

//刪除購物車全部的內容
let discardAllBtn=document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();//A標籤的時候可以用
    axios.delete(`${url}/api/livejs/v1/customer/${api_path}/carts`)
        .then(function(response){
            alert('成功刪除整筆訂單');
            getCartList();
        })
        .catch(function (error) {
            console.log(error);
            alert('購物車已經清空，請勿重複點擊')
        })
})