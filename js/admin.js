//要在 CLIENT端可以收到
//console.log('hi')
let orderData =[];
const orderList = document.querySelector('.js-orderList')

//初始化
 function init(){
    getOrderList();
 };
 init();


 function  renderC3(){
    console.log(orderData);//確認值有撈回來
    //物件資料蒐集
    let total ={};
    orderData.forEach(function(item){
        //針對products裡面的類別再跑一次去蒐集全部的類別，再放到total
        item.products.forEach(function(productItem){
            if(total[productItem.category]== undefined){//如果根本沒有該項目時 == undefine
                //將物品乘上金額並賦予在category類別上，因為是分類，總共賣幾個品項，不是只是要總價
                total[productItem.category]=(productItem.price)*(productItem.quantity);
            }else{
                total[productItem.category]+=(productItem.price)*(productItem.quantity);
            }
        })
    })
    //console.log(total);
    let categoryAry = Object.keys(total);
    //console.log(categoryAry);//' 物件中的屬性帶入名為categoryAry的陣列
    let newData =[];
    categoryAry.forEach(function(item){
        let ary=[];
        ary.push(item);
        ary.push(total[item]);//因為是物件將屬性用[]
        //console.log(ary);
        newData.push(ary);
        //console.log(newData);
    })
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
            // colors:{
            //     "Louvre 雙人床架":"#DACBFF",
            //     "Antony 雙人床架":"#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
        },
    });
 }
function getOrderList(){
    axios.get(`${url}/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
    }})
    .then(function(response){
        orderData=response.data.orders;
        //console.log(orderData);
        //組訂單字串
        let productStr ='';
        let str=``;
        orderData.forEach(function(item){
            //組時間字串
            const timeStamp = new Date(item.createdAt*1000);//要乘1000為毫秒
            const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`;
            //console.log(orderTime);
           
            //組產品字串
            item.products.forEach(function(productItem){
                productStr+=`<p>${productItem.title}X${productItem.quantity}</p>`
                })

                //判斷訂單處理狀態 false 轉換成文字
                let orderStaue = '';
                if(item.paid == true){
                    orderStaue='已處理';
                }else{
                    orderStaue='未處理';
                }

                //組訂單字串
                str+=`<tr>
                        <td>${item.id}</td>
                        <td>
                        <p>${item.user.name}</p>
                        <p>${item.user.tel}</p>
                        </td>
                        <td>${item.user.address}</td>
                        <td>${item.user.email}</td>
                        <td>
                        <p>${productStr}</p>
                        </td>
                        <td>${orderTime}</td>
                        <td class="orderStatus">
                            <a href="#" class='js-orderStatus' data-id='${item.id}'  data-status='${item.paid}'>${orderStaue}</a>
                        </td>
                        <td>
                        <input type="button" class="delSingleOrder-Btn js-orderDelete" value="刪除" data-id="${item.id}">
                        </td>
                    </tr>`
            })
        orderList.innerHTML=str;
        renderC3();//資料撈回來後再跟訂單列表一起渲染出圖表(連動的方法)
    })
    .catch(function (error) {
        console.log(error);
        //alert('購物車已經清空，請勿重複點擊')
    })
}

orderList.addEventListener('click',function(e){
    e.preventDefault();
    const tagetClass= e.target.getAttribute('class')//要抓點擊時，class的名稱
    let status=e.target.getAttribute('data-status');
    let id=e.target.getAttribute('data-id');
    //console.log(tagetClass);
    if( tagetClass == "delSingleOrder-Btn js-orderDelete"){
        deleteOderItem(id);
        //alert('點了刪除');
        //deleteOrder();
        return;
    }
    if( tagetClass == "js-orderStatus"){
       
       changeOrderStatus(status,id);
        //console.log(e.target.textContent);
        return;
    }
  
    //axios
});

//修改訂單狀態
function changeOrderStatus(status,id){
    console.log(status,id);
    //訂單狀態的部分，付款狀況從false變成true
    let newStatus;
    if(status==true){
        newStatus=false;
    }else{
        newStatus=true;
    }

    axios.put(`${url}/api/livejs/v1/admin/${api_path}/orders`,
                {
                    "data": {
                        "id": id,
                        "paid": newStatus
                            }
                },{
                    headers:{
                        'Authorization':token,
                            }
                }
            )
            .then(function(response){
                alert('修改訂單狀態為已處理');
                getOrderList();
            })
            .catch(function (error) {
                console.log(error);
                
            }) 
}

function deleteOderItem(id){
    console.log(id);
    //刪除訂單
    axios.delete(`${url}/api/livejs/v1/admin/${api_path}/orders/${id}`,{
        headers:{
            'Authorization':token,
                }
            })
            .then(function(response){
                alert('刪除成功');
                getOrderList();
            })
            .catch(function (error) {
                console.log(error);
            }) 
}