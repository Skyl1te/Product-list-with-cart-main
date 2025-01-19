const buyingQuantity = document.querySelector('.buying-cart__quantity')
const buyingCart = document.querySelector('.buying-cart')
const displayTotalPrice = buyingCart.querySelector('.orders-total__price')
const submitBtn = buyingCart.querySelector('.order-submit-btn')
const confirmation = buyingCart.querySelector('.confirmation')
const confirmBtn = buyingCart.querySelector('.new-order-btn')

let totalAmount = 0
let totalPrice = 0

displayTotalPrice.textContent = totalPrice
buyingQuantity.textContent = totalAmount

async function getProductCardsData(url = 'data.json') {
    const response = await fetch(url)
    const data = await response.json()

    return data
}

class productCardsItem {
	constructor({ name, image, category, price }, container = '.product-cards') {
		this.name = name
		this.image = image.mobile
		this.category = category
		this.price = price
		this.container = document.querySelector(container)
		this.quantityProduct = 0 
		this.totalProductAmount = 0

		this._createCard()
	}

	_createCard() {
		const cardHTML = `
        <div class="product-card">
            <div class="product-card__image-box">
                <img src="${this.image}" alt="product icon" class="product-card__image">
                <div class="product-card__add-card">
                    <img class="product-card__quantity-btn decrement-btn" src="assets/images/icon-decrement-quantity.svg" alt="-">
                    <img id="product-add-to-cart" class="product-card__add-to-cart-btn" src="assets/images/icon-add-to-cart.svg" alt="add icon">
                    <span class="product-card__add-text">Add to Cart</span>
                    <img class="product-card__quantity-btn increment-btn" src="assets/images/icon-increment-quantity.svg" alt="+">
                </div>
            </div>
            <div class="product-card__text">
                <h5 class="product-card__title">${this.category}</h5>
                <h3 class="product-card__subtitle">${this.name}</h3>
                <p class="product-card__price">${this.price.toFixed(2)}</p>
            </div>
        </div>`

		this.container.insertAdjacentHTML('beforeend', cardHTML)

		const cardElement = this.container.lastElementChild
		const addToCartBtn = cardElement.querySelector('.product-card__add-to-cart-btn')
		const quantityBtns = cardElement.querySelectorAll('.product-card__quantity-btn')
		const displayQuantity = cardElement.querySelector('.product-card__add-text')

		displayQuantity.textContent = 'Add to Cart'

		addToCartBtn.addEventListener('click', () => {
			this.toggleQuantityButtons(cardElement)
		})
		displayQuantity.addEventListener('click', () => {
			this.toggleQuantityButtons(cardElement)
		})

		cardElement.querySelector('.decrement-btn').addEventListener('click', () => {
			this.updateQuantity(false, displayQuantity, cardElement)

			if (this.quantityProduct <= 0) {
				this.unActiveAddCart(cardElement, displayQuantity)
				displayQuantity.textContent = 'Add to Cart'
			}
		})
		cardElement.querySelector('.increment-btn').addEventListener('click', () => {
			this.updateQuantity(true, displayQuantity, cardElement)
		})

		submitBtn.addEventListener('click', () => {
			this.confirmOrder(buyingCart)
		})
		
		confirmBtn.addEventListener('click', () => {
			this.startNewOrder()
		})

	}

	confirmOrder(buyingCart) {
		submitBtn.style.display = 'none'
		confirmBtn.style.display = 'block'
		confirmation.style.display = 'block'
		buyingQuantity.style.display = 'none'
		buyingCart.querySelector('.buying-cart__title').style.display = 'none'
		buyingCart.querySelector('.order-delivery').style.display = 'none'
		buyingCart.querySelectorAll('.order__image').forEach(img => {
			img.style.display = 'block'
		})
		buyingCart.querySelectorAll('.order__cancel-btn').forEach(btn => {
			btn.style.display = 'none'
		})

		buyingCart.querySelectorAll('#secondTotal').forEach(text => {
			text.style.display = 'inline'
		})
		buyingCart.querySelectorAll('#firstTotal').forEach(text => {
			text.style.display = 'none'
		})

		buyingCart.style.overflow = 'scroll'
		buyingCart.style.position = 'fixed'

		buyingCart.style.height = '70vh'
		buyingCart.style.maxWidth = '500px'
		buyingCart.style.margin = '0'
		buyingCart.style.borderRadius = '.5rem .5rem 0 0'

		document.querySelector('.container').style.padding = '0'
		submitBtn.textContent = 'Start New Order'

		if (window.innerWidth >= 320) {
			buyingCart.style.left = '0'
			buyingCart.style.bottom = '0'

		}
		if (window.innerWidth >= 768) {
			buyingCart.style.left = '50%'
			buyingCart.style.top = '50%'
			buyingCart.style.transform = 'translate(-50%, -50%)' 
		}

		const overlay = document.createElement('div')
		overlay.style.position = 'fixed'
		overlay.style.top = '0'
		overlay.style.left = '0'
		overlay.style.width = '100%'
		overlay.style.height = '100%'
		overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
		overlay.style.zIndex = '999' 
		document.body.appendChild(overlay)

		document.body.style.overflow = 'hidden'
	}

	startNewOrder() {
		window.location.reload()
	}
	
	toggleQuantityButtons(cardElement) {
		const quantityBtns = cardElement.querySelectorAll('.product-card__quantity-btn')
		const displayQuantity = cardElement.querySelector('.product-card__add-text')
		const addToCartBtn = cardElement.querySelector('#product-add-to-cart')

		cardElement.querySelector('.product-card__image-box').style.border = '2px solid hsl(14, 86%, 42%)'
		cardElement.querySelector('.product-card__image-box').style.borderRadius = '.7rem'

		quantityBtns.forEach(btn => btn.style.display = 'block')
		addToCartBtn.style.display = 'none'

		cardElement.querySelector('.product-card__add-card').style.justifyContent = 'space-between'
		cardElement.querySelector('.product-card__add-card').style.background = 'hsl(14, 86%, 42%)'

		displayQuantity.textContent = this.quantityProduct
		displayQuantity.style.color = '#fff'

	}

	updateQuantity(isIncrement, displayQuantity, cardElement) {
		if (isIncrement) {
			this.quantityProduct += 1
			totalAmount += 1
			totalPrice += this.price
			this.totalProductAmount += 1
			this.addProductToList(buyingCart, cardElement)

		} else {
			if (this.quantityProduct > 0) {
				this.quantityProduct -= 1
				totalAmount -= 1
				totalPrice -= this.price
				this.totalProductAmount -= 1
				this.removeProductOfList(buyingCart)
				if (this.quantityProduct <= 0) {
					this.unActiveAddCart(cardElement, displayQuantity)
				}
			}
		}

		displayQuantity.textContent = this.quantityProduct
		buyingQuantity.textContent = totalAmount
		displayTotalPrice.textContent = totalPrice.toFixed(2)
		this.checkTotal()
	}

	unActiveAddCart(cardElement, displayQuantity) {
		const quantityBtns = cardElement.querySelectorAll('.product-card__quantity-btn')
		quantityBtns.forEach(btn => { btn.style.display = 'none' })

		cardElement.querySelector('#product-add-to-cart').style.display = 'block'
		cardElement.querySelector('.product-card__add-card').style.justifyContent = 'center'
		cardElement.querySelector('.product-card__add-card').style.background = 'hsl(20, 50%, 98%)'
		cardElement.querySelector('.product-card__image-box').style.border = '0 solid hsl(14, 86%, 42%)'

		displayQuantity.textContent = 'Add to Cart'
		displayQuantity.style.color = 'hsl(14, 65%, 9%)'

	}

	checkTotal() {
		if (totalAmount <= 0) {
			buyingCart.querySelector('.buying-cart__subtitle').style.display = 'block'
			buyingCart.style.background = 'url("../../assets/images/illustration-empty-cart.svg") no-repeat center / auto, hsl(20, 50%, 98%)'
			buyingCart.querySelector('.orders-total').style.display = 'none'
			buyingCart.querySelector('.order-delivery').style.display = 'none'
			buyingCart.querySelector('.order-submit-btn').style.display = 'none'
		} else {
			buyingCart.querySelector('.buying-cart__subtitle').style.display = 'none'
			buyingCart.style.background = 'hsl(20, 50%, 98%)'
			buyingCart.querySelector('.orders-total').style.display = 'flex'
			buyingCart.querySelector('.order-delivery').style.display = 'flex'
			buyingCart.querySelector('.order-submit-btn').style.display = 'block'
		}
	}
	

	addProductToList(buyingCart, cardElement) {
		if (this.totalProductAmount > 1) {
			const orderAmount = buyingCart.querySelector(`.order[data-name="${this.name}"]`)
			if (orderAmount) {
				const amountElement = orderAmount.querySelector('.order__amount')
				const totalPriceElement = orderAmount.querySelectorAll('.order__total-price')

				amountElement.textContent = this.totalProductAmount
				totalPriceElement.forEach(el => {
					el.textContent = (this.price * this.totalProductAmount).toFixed(2)
				})
			}
		} else {
			const orderHTML = `
				<div class="order" data-name="${this.name}">
					<div class="order__image">
						<img src="${this.image}" alt="image">
					</div>
					<div class="order__text">
						<h4 class="order__title">${this.name}</h4>
						<p class="order__subtitle">
							<span class="order__amount">${this.totalProductAmount}</span>
							<span class="order__price">${this.price.toFixed(2)}</span>
							<span class="order__total-price" id="firstTotal">${(this.price * this.totalProductAmount).toFixed(2)}</span>
						</p>
					</div>
					<div class="order__cancel-btn">
						<img src="assets/images/icon-remove-item.svg" alt="cancel">
					</div>
					<span class="order__total-price" id="secondTotal">${(this.price * this.totalProductAmount).toFixed(2)}</span>

				</div>`

			buyingCart.querySelector('.orders').insertAdjacentHTML('beforeend', orderHTML)

			const cancelBtn = buyingCart.querySelector(`.order[data-name="${this.name}"] .order__cancel-btn img`)
			cancelBtn.addEventListener('click', () => {
				this.removeProduct(buyingCart, cardElement)
			})
		}
	}

	removeProductOfList(buyingCart) {
    if (this.totalProductAmount >= 1) {
        const orderAmount = buyingCart.querySelector(`.order[data-name="${this.name}"]`)
        if (orderAmount) {
            const amountElement = orderAmount.querySelector('.order__amount')
            const totalPriceElement = orderAmount.querySelector('.order__total-price')
            
            amountElement.textContent = this.totalProductAmount
            totalPriceElement.textContent = (this.price * this.totalProductAmount).toFixed(2)
        }
    } else {
        const orderToRemove = buyingCart.querySelector(`.order[data-name="${this.name}"]`)
        if (orderToRemove) {
            buyingCart.querySelector('.orders').removeChild(orderToRemove) 
        }
    }
}

	removeProduct(buyingCart, cardElement) {
		const orderToRemove = buyingCart.querySelector(`.order[data-name="${this.name}"]`)

		if (orderToRemove) {
			const totalProductPrice = this.price * this.totalProductAmount
			const displayQuantity = cardElement.querySelector('.product-card__add-text')

			totalAmount -= this.totalProductAmount
			totalPrice -= totalProductPrice

			this.totalProductAmount = 0
			this.quantityProduct = 0

			displayTotalPrice.textContent = totalPrice
			displayQuantity.textContent = this.quantityProduct
			buyingQuantity.textContent = totalAmount

			this.unActiveAddCart(cardElement, displayQuantity)
			buyingCart.querySelector('.orders').removeChild(orderToRemove)

			this.checkTotal()
		}
	}

}

document.addEventListener('DOMContentLoaded', () => {
	getProductCardsData()
		.then(data => {
			data.forEach(item => {
				new productCardsItem(item)
			})
		})
})

