'use strict'

let btns = document.querySelector('.buttons'),
	img = document.createElement('img'),
	list = document.querySelector('ul.list'),
	favourites = document.querySelector('.favourites'),
	empty = favourites.querySelector('.favourites_empty'),
	catalog = document.querySelector('.catalog'),
	btn = document.querySelectorAll('.btn'),
	showImage = document.querySelector('.showImage'),
	closeShowImage = document.querySelector('.close-showImage');

btns.addEventListener('click', function(e) {
	let target = e.target;
	btn.forEach(item => item.classList.remove('btn_active'));
	target.classList.add('btn_active');
	if (target==btn[0]) {
		catalog.classList.remove('hide');
		favourites.classList.add('hide');
		favourites.classList.remove('flex')
	} else {
		favourites.classList.remove('hide');
		favourites.classList.add('flex')
		catalog.classList.add('hide');
	}
});

closeShowImage.addEventListener('click', function() {
	showImage.classList.remove('flex');
});

function preloader(el) {
	img.setAttribute("src","images/loader.gif");
	img.classList.add('preloader');
	el.append(img);
} 

function showError(el, cl) {
	let html = `<div class="${cl}"><img class = "image_empty" src="images/empty.png" alt=""><div class="error__message"><p class="title">Сервер не отвечает</p><p class="text">Уже работаем над этим</p></div></div>`;
	el.insertAdjacentHTML('beforeEnd', html);
}

function createList(data) {
	let li = document.createElement('li');
	li.classList.add('list__item');
	li.innerHTML = `<span class="close"></span> ${data}`;
	list.append(li);
}

function createSublist(data) {	
	let ul = document.querySelectorAll('.sublist')[0];	
	while (ul.firstChild) {
	    ul.firstChild.remove();
	}
	
	data.forEach(item => {
		let li = document.createElement('li');
		li.classList.add('sublist__item');
		li.innerHTML = `<span class="close-sublist"></span> ${item.title}`;
		ul.append(li);
	});	
}

function createImages(data) {
	let parantDiv = document.querySelector('.images');	
	while (parantDiv.firstChild) {
	    parantDiv.firstChild.remove();
	}
	
	data.forEach(item => {
		let div = document.createElement('div'),
			img = document.createElement('img');
		div.innerHTML = '<img class= "image_icon" src="images/star_empty.png" alt="">';
		div.classList.add('image__item');
		div.setAttribute('data-text', `${item.title}`);
		parantDiv.append(div);
		img.classList.add('image');
		img.setAttribute("src",`${item.url}`);
		div.append(img);
	});	

	let image = document.querySelectorAll('.image'),
		imageItem = document.querySelectorAll('.image__item'),
		imageIcon = document.querySelectorAll('.image_icon');

	imageItem.forEach((item ,index) => item.addEventListener('click', function(e) {			
		let target = e.target;
		if (target==image[index]) {
			let item = showImage.querySelector('.showImage__item');
			showImage.classList.add('flex');
			let src = image[index].getAttribute("src");
			item.setAttribute("src", src);
		}	
		
		if (target == imageIcon[index]) {
			let atr = imageIcon[index].getAttribute('src');

			if(atr == 'images/star_empty.png') {
				imageIcon[index].setAttribute("src", "images/star_active.png");
				let favouriteItem = imageItem[index].cloneNode(true);
				let p = document.createElement('p');
				p.classList.add('image__title');
				p.textContent = favouriteItem.getAttribute("data-text");
				favouriteItem.append(p);
				favouriteItem.setAttribute('data-id', `${localStorage.length + 1}`);
				favourites.prepend(favouriteItem);
				console.log(favouriteItem);

				localStorage.setItem(`${localStorage.length + 1}`, favouriteItem.outerHTML);
				
			} else {
				imageIcon[index].setAttribute("src", "images/star_empty.png");
				let src = image[index].getAttribute("src");
				let favouriteImgs = favourites.querySelectorAll('.image__item');
				favouriteImgs.forEach(favourite => {
					if (favourite.children[1].getAttribute('src') == src) {
						favourite.remove();
						localStorage.removeItem(`${favourite.dataset.id}`);
					}
				});	
			}
			checkFavourites();
		}

			let favouriteItemStar = favourites.querySelectorAll('.image_icon');
			favouriteItemStar.forEach(item => item.addEventListener('click', function(event) {
				let attr = item.parentNode.getAttribute('data-text');
				imageItem.forEach((item,index)=> {
					if(item.getAttribute('data-text') == attr) {
						item.children[0].setAttribute("src", "images/star_empty.png");
					}
				})
				item.parentNode.remove();
				localStorage.removeItem(`${item.parentNode.dataset.id}`);
				checkFavourites();
			}))
	}));

	let name = document.querySelector('.name');

	imageItem.forEach(item => item.addEventListener('mouseenter', () => name.style.display = 'inline-block'));
	imageItem.forEach(item => item.addEventListener('mouseleave', () => name.style.display = 'none'));
	imageItem.forEach(item => item.addEventListener('mousemove', function(event) {
		let x = event.pageX;
		let y = event.pageY;
		name.textContent = item.getAttribute('data-text');
		name.style.left = (x-75) + "px";
		name.style.top = (y+40) + "px";
	}));
}
	
let checkFavourites = () => (favourites.querySelectorAll('.image__item').length >= 1)?empty.classList.add("hide"):empty.classList.remove("hide");

async function getUsers() {
	preloader(list);
	try {
	    let response = await fetch('https://json.medrating.org/users/');
		let users = await response.json();
		users.forEach(item => createList(item.name));
		img.remove();
		console.log('Пользователи загружены');
	} catch(response) {
	    img.remove();
		showError(list, "error reverse");
	}
	
	let close  = document.querySelectorAll('.close')[1];

	close.addEventListener('click', function() {

	  	let ul = document.createElement('ul');
		ul.classList.add('sublist');
		if(close.nextElementSibling == null){				
			close.nextSibling.after(ul);
			getAlbum();		 			
		} else {
			document.querySelector('.sublist').classList.toggle('hide');
			getAlbum()
		}
	});
}

getUsers();

async function getAlbum() {
	let listItem = document.querySelectorAll('.list__item')[1];
	preloader(listItem);
	try {
	    let response = await fetch('https://json.medrating.org/albums?userId=3');
		let albums = await response.json();
		createSublist(albums);
		img.remove();
		console.log('Альбомы загружены!');
	} catch(response) {
	    img.remove();
		showError(listItem, "error");
	}

	let closeSublist  = document.querySelectorAll('.close-sublist')[1];
	closeSublist.addEventListener('click', function() {
	  	let div = document.createElement('div');
		div.classList.add('images');
		if(closeSublist.nextElementSibling == null){				
			closeSublist.nextSibling.after(div);
			getImages();		 			
		} else {
			document.querySelector('.images').classList.toggle('hide');
			getImages()
		}
	});
}

async function getImages() {
	let sublistItem = document.querySelectorAll('.sublist__item')[1];
	preloader(sublistItem);
	try {
	    let response = await fetch('https://json.medrating.org/photos?albumId=2');
		let images = await response.json();

		createImages(images.slice(0,11));
		img.remove();
		console.log('Картинки загружены!');
	} catch(response) {
	    img.remove();
		showError(sublistItem, "error");
	}
}


if (localStorage.length != 0) {
    // цикл по количеству пар ключ/значение
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)
        let item = `${localStorage.getItem(key)}`
        // добавляем в избранное
        favourites.insertAdjacentHTML('afterbegin', item)
    }

	let favouriteItemStar = favourites.querySelectorAll('.image_icon');
	favouriteItemStar.forEach(item => item.addEventListener('click', function() {
		localStorage.removeItem(`${item.parentElement.dataset.id}`);
		item.parentNode.remove();
		checkFavourites();
	}))
}

checkFavourites();