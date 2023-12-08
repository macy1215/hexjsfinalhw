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
                <a href="#" class="addCardBtn" data-id='${item.id}'>加入購物車</a>
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
    productWrap.innerHTML=str;
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

const addCardBtn=document.querySelector('.addCardBtn');
productWrap.addEventListener('click',function(e){
    //回覆他的初始值，因為點加入購物車有預設 a #
    e.preventDefault();
    console.log(e.target.getAttribute('data-id'));
    productData.forEach(function(item,index){

    });
});