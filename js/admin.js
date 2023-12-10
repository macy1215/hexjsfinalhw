//要在 CLIENT端可以收到
//console.log('hi')
let orderData =[];
const orderList = document.querySelector('.js-orderList')

//初始化
 function init(){
    getOrderList();
 };
 init();


function getOrderList(){
    axios.get(`${url}/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
    }})
    .then(function(response){
        orderData=response.data.orders;
        console.log(orderData);
        orderData.forEach(function(item){
            let str=``;
            str+=`<tr>
            <td>${item.id}</td>
            <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
            <p>Louvre 雙人床架</p>
            </td>
            <td>${item.createdAt}</td>
            <td class="orderStatus">
            <a href="#">${item.paid}</a>
            </td>
            <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
            </td>
        </tr>`
        orderList.innerHTML=str;
        })
        
    })
    .catch(function (error) {
        console.log(error);
        alert('購物車已經清空，請勿重複點擊')
    })
}

function renderOrderList(){

}