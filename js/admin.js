//要在 CLIENT端可以收到
//console.log('hi')
let orderData =[];
const orderList = document.querySelector ('.js-orderList');

//初始化
 function init(){
    getOrderList();
 };
 init();


 function  renderC3(){
    //console.log(orderData);//確認值有撈回來
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
    // let chart = c3.generate({
    //     bindto: '#chart', // HTML 元素綁定
    //     data: {
    //         type: "pie",
    //         columns: rankSortAry,
    //         // colors:{
    //         //     "Louvre 雙人床架":"#DACBFF",
    //         //     "Antony 雙人床架":"#9D7FEA",
    //         //     "Anty 雙人床架": "#5434A7",
    //         //     "其他": "#301E5F",
    //         // }
            
    //     },
    //     colors:{
    //       partten:["#301E5F","#5434A7","#9D7FEA","#DACBFF"]       
    //     }
    // });
 };

 //進階用法 sort
 function renderC3_lv2(){
    //資料蒐集
    let obj={};
    orderData.forEach(function(item){
        item.products.forEach(function(productItem){
            if(obj[productItem.title] === undefined){
                obj[productItem.title] = productItem.quantity * productItem.price;
                //console.log(obj)
            }else{
                obj[productItem.title] += productItem.quantity * productItem.price;
            }
        })
    });
    console.log(obj);
 
    //拉出資料關聯
    let originAry=Object.keys(obj);
   // console.log(originAry);

   //產出C3格式的資料
   let rankSortAry=[];

   originAry.forEach(function(item){
     let ary=[];
     ary.push(item);
     ary.push(obj[item])//推入該屬性的值
     //console.log(ary);
    rankSortAry.push(ary);//換成c3要得格式，並且拿來做比較。並將最後的項目轉換成其他
   })
   //比大小，降冪排列(目的:取營收前三名的品項當主要色塊，把其餘的品項加總起來當成一個色塊)

   rankSortAry.sort(function(a,b){
    return b[1]-a[1];
   })
   //console.log(rankSortAry);

   //比數超過4以上，就統整為其他 0.1.2.3....第四筆所以是大於3
   if(rankSortAry.length >3){
        let otherTotal = 0; //其他的總數
        rankSortAry.forEach(function(item,index){
            if(index > 2){
                otherTotal+=rankSortAry[index][1];
            }
        })
        rankSortAry.splice(3,rankSortAry.length-1);//第三筆之後的資料都移除，不需要再有第4明後的資料 splice[索引（起始為 0）,刪除的,新增的];
        rankSortAry.push(['其他',otherTotal]);
   }

   //console.log(rankSortAry);
   c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: rankSortAry,
            // colors:{
            //     "Louvre 雙人床架":"#DACBFF",
            //     "Antony 雙人床架":"#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
            
        },
        color:{
            pattern:["#301E5F","#5434A7","#9D7FEA","#DACBFF"]       
        }
    });

 };


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
        renderC3_lv2();//
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

//刪除訂單
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

//刪除全部訂單
const discardAllBtn=document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    axios.delete(`${url}/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
                }
            })
            .then(function(response){
                alert('刪除全部訂單成功');
                getOrderList();
            })
            .catch(function (error) {
                console.log(error);
            }) 
})

//util js
function toThousands(x){ 
	let parts = x.toString().split("."); //將小數點先移除
	parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
	return parts.join(".");
}