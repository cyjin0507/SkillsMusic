class List {
    constructor(data) {
        this.data = data
        this.type = "all"

        this.sortMenu()
        this.sortData()

        this.addEvent()
    }

    sortMenu() {
        let menu = []
        this.data.forEach(data => {
            if (!menu.includes(data.category)) {
                menu.push(data.category)
            }
        })
        this.menu = menu
        this.drawMenu()
        this.menuControl()
    }

    drawMenu() {
        this.menu.forEach(menu => {
            $('#main-menu').append(`
                <li data-category="${menu}">
                    <a href="#" data-category="${menu}"><i data-category="${menu}" class="fa fa-youtube-play fa-2x"></i> <span data-category="${menu}">${menu}</span></a>
                </li>    
            `)
        })
    }


    sortData() {
        let printData = ""
        if (this.type == "all") {
            printData = this.data
        } else {
            printData = this.data.filter(e => e.category == this.type)
        }

        this.drawList(printData)
    }

    drawList(data) {
        $('.row > .contents').html('')

        data.forEach(e => {
            $('.row > .contents').append(`
            <div class="col-md-2 col-sm-2 col-xs-2 product-grid">
                <div class="product-items">
                    <div class="project-eff">
                        <img class="img-responsive" src="images/${e.albumJaketImage}" alt="Time for the moon night">
                    </div>
                    <div class="produ-cost">
                        <h5>${e.albumName}</h5>
                        <span>
                            <i class="fa fa-microphone"> 아티스트</i> 
                            <p>${e.artist}</p>
                        </span>
                        <span>
                            <i class="fa  fa-calendar"> 발매일</i> 
                                         
                            <p>${e.release}</p>
                        </span>
                        <span>
                            <i class="fa fa-money"> 가격</i>
                            <p>￦${e.price}</p>
                        </span>
                        <span class="shopbtn">
                            <button data-name="${e.albumName}" class="btn btn-default btn-xs">
                                <i data-name="${e.albumName}" class="fa fa-shopping-cart"></i> 쇼핑카트담기
                            </button>
                        </span>
                    </div>
                </div>
            </div>
            `)
        })

        new Basket(this.data)
    }


    addEvent() {
        $('#main-menu > li:not(".text-center")').click(e => {
            this.type = e.target.dataset.category
            this.sortData()
            this.menuControl()
        })

        $('.search button').click(() => {
            let value = $('.search input').val()

            let printData = this.data.filter(e => e.albumName == value)
            this.drawList(printData)
            this.type = printData[0].category
            this.menuControl()

            $('.search input').val('')
        })

    }

    menuControl() {
        $('#main-menu > li:not(".text-center") > a').removeClass('active-menu')
        $(`#main-menu > li:not(".text-center") > a[data-category='${this.type}']`).addClass('active-menu')
        $('#page-inner > .row h2').html(this.type)
    }

}

class Basket {
    constructor(data) {
        this.data = data
        if (localStorage.getItem('data') == undefined) {
            localStorage.setItem('data', '[]')
        }

        this.basketList()
        this.addEvent()

    }

    addEvent() {
        // 쇼핑카트담기 버튼
        $('.shopbtn > button').click((e) => {
            let name = e.target.dataset.name
            this.saveData(name)
        })

        // 개수 증가, 감소
        $('.table-bordered > tbody').change((e)=> {
            if(e.target.dataset.check == 'input') {
                let cnt = $(e.target).val()
                if(cnt <= 0) {
                    $(e.target).val(1)
                    return
                }
                let name = e.target.dataset.name
                this.changeData(name, cnt)
            }
        })

        // 삭제 버튼
        $('.table-bordered > tbody').click((e)=> {
            if(e.target.dataset.check == 'delete') {
                this.deleteData(e.target.dataset.name)
            }
        })

        // 결제하기 버튼
        $('.buyBtn').click(()=> {
            this.buyData()
        })

    }

    saveData(name) {
        let data = JSON.parse(localStorage.getItem('data'))

        let bool = false
        data.forEach(e => {
            if (e[0] == name) {
                e[1] = e[1] + 1
                bool = true
            }
        })

        if (!bool) {
            let insert = [
                name,
                1
            ]
            data.push(insert)
        }

        localStorage.setItem('data', JSON.stringify(data))
        alert('장바구니에 담았습니다.')
        this.basketList()
    }

    changeData(name, cnt) {
        let localData = JSON.parse(localStorage.getItem('data'));
        localData.forEach(e => {
            if (e[0] == name) {
                e[1] = cnt
            }
        })

        localStorage.setItem('data', JSON.stringify(localData))
        this.basketList()
    }

    deleteData(name) {
        let localData = JSON.parse(localStorage.getItem('data'))
        
        let cnt = 0
        let index = 0
        localData.forEach(e=> {
            if(e[0] == name) {
                index = cnt
            }
            cnt++
        })
        
        localData.splice(index,1)
        localStorage.setItem('data', JSON.stringify(localData))
        this.basketList()
    }

    buyData() {
        localStorage.setItem('data', '[]')
        alert("앨범이 결제되었습니다.")
        this.basketList()
        location.reload()
    }

    basketList() {
        let localData = JSON.parse(localStorage.getItem('data'))
        this.basket = []
        localData.forEach(e => {
            let insertData = [
                this.data.find(i => i.albumName == e[0]),
                e[1]
            ]
            this.basket.push(insertData)
        })
        this.basketDraw()
    }

    basketDraw() {
        $('.table-bordered > tbody').html('')
        let totalPrice = 0
        let totalCnt = 0
        this.basket.forEach(e=> {
            $('.table-bordered > tbody').append(`
                <tr>
                    <td class="albuminfo">
                        <img src="images/${e[0].albumJaketImage}">
                        <div class="info">
                            <h4>${e[0].albumName}</h4>
                                <span>
                                    <i class="fa fa-microphone"> 아티스트</i> 
                                    <p>${e[0].artist}</p>
                                </span>
                                <span>
                                    <i class="fa  fa-calendar"> 발매일</i> 
                                    <p>${e[0].release}</p>
                                </span>
                            </div>
                        </td>
                        <td class="albumprice">
                            ￦ ${e[0].price}
                        </td>
                        <td class="albumqty">
                            <input type="number" data-check="input" data-name="${e[0].albumName}" class="form-control" value="${e[1]}">
                        </td>
                        <td class="pricesum">
                            ￦ ${parseInt(e[0].price) * e[1]}
                        </td>
                        <td>
                            <button class="btn btn-default deleteBtn" data-check="delete" data-name="${e[0].albumName}">
                                <i class="fa fa-trash-o"></i> 삭제
                            </button>
                        </td>
                    </tr>
            `)
            totalPrice += parseInt(e[0].price) * e[1]
            totalCnt += parseInt(e[1])
        })

        $('.totalprice').html(`
            <h3>총 합계금액 : <span>￦${totalPrice}</span> 원</h3>
        `)

        $('.btn[data-target="#myModal"]').html(`
            <i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${totalCnt}</strong> 개 금액 ￦ ${totalPrice}원</a> 
        `)
    }

}

$.getJSON('/music_data.json', json => {
    new List(json.data)
})
