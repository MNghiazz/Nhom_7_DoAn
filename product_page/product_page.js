import { fetchData, url } from "../api.js";

import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/+esm'

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch product details using the product ID

const producSession = document.querySelector("[product-session]");
const bookInformation = document.querySelector("[book-information]")
const bookContent = document.querySelector("[book-content]")

function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.nav-wrap ul li.act').classList.remove('act');

    document.querySelectorAll('.nav-wrap ul li')[tabIndex - 1].classList.add('act');

    document.getElementById('bookContent').style.display = 'none';
    document.getElementById('catalogContent').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('bookContent').style.display = 'block';
    } else if (tabIndex === 2) {
        
        document.getElementById('catalogContent').style.display = 'block';
    } else if (tabIndex === 3) {
    }
}


function changePage(i) {
    thisPage = i;
    Loading();
}

let thisPage = 1;
let limit = 12;
const list = document.querySelectorAll('.catalog-content-wrap .volume-wrap .volume .chapters > li');

function Loading() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
        if (key >= beginGet && key <= endGet) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    listPage();
}
Loading();

function listPage() {
    let count = Math.ceil(list.length / limit);
    const listChapter = document.querySelector('.pagination');

    // Clear existing pagination
    listChapter.innerHTML = '';

    if (thisPage != 1 && thisPage >= 4) {
        let firstPage = document.createElement('li');
        firstPage.innerHTML = `
        <a aria-label="Previous">
            <span aria-hidden="true">Trang đầu</span>
        </a>
        `;
        firstPage.addEventListener('click', function () {
            changePage(1);
        });
        listChapter.appendChild(firstPage);
    }

    if (thisPage != 1) {
        let prev = document.createElement('li');
        prev.innerHTML = `
            <a aria-label="Previous">
                <span aria-hidden="true">«</span>
            </a>
        `;
        prev.addEventListener('click', () => changePage(thisPage - 1));
        listChapter.appendChild(prev);
    }

    for (let i = 1; i <= count; i++) {
        let newPage = document.createElement('li');
        newPage.innerHTML = `
            <a>
                ${i}
                <span class="sr-only" style>(current)</span>
            </a>
        `;
        if (i == thisPage) {
            newPage.classList.add('active');
        }

        newPage.addEventListener('click', () => changePage(i));
        listChapter.appendChild(newPage);
    }

    if (thisPage != count) {
        let next = document.createElement('li');
        next.innerHTML = `
            <a aria-label="Next">
                <span aria-hidden="true">»</span>
            </a>
        `;
        next.addEventListener('click', () => changePage(thisPage + 1));
        listChapter.appendChild(next);
    }

    if (thisPage != count) {
        let finalPage = document.createElement('li');
        finalPage.innerHTML = `
            <a  aria-label="Next">
                <span aria-hidden="true">Trang cuối</span>
            </a>
        `;
        finalPage.addEventListener('click', () => changePage(count));
        listChapter.appendChild(finalPage);
    }
}


fetchData(url.productsId(productId),null,  async function(bookDetail) {
    const {
        id, 
            name, 
            description, 
            image, 
            author : { name: authorName, id: authorId},
            category : [{name: categoryName, id: categoryId}],
            rating,
            numReviews
    } = bookDetail;

    const bookImg = document.createElement('div');
    bookImg.classList.add("book-img");
    bookImg.innerHTML = `
        <img src="${image}" alt="${name}">
    `;

    bookInformation.appendChild(bookImg);
    
    const bookInf = document.createElement('div');
    bookInf.classList.add("book-info");
    bookInf.innerHTML = `
        <h1 class="book-title" style="color: #54504e;">${name}</h1>
        <p class="author-categories">
            <a class="author me-3">${authorName}</a>      
        </p>
        
        <p class="function-button">
            <a class="btn btn-danger me-3" id="readbtn">Đọc Truyện</a>
            <a class="btn btn-outline-primary me-3" id="favoritebtn">Yêu Thích</a>
            <a class="btn btn-success" id="rentbtn">Thuê Truyện</a>
        </p>
    `;

    bookInf.querySelector('.author-categories').addEventListener('click',  function() {
        // Navigate to product page with the ID of the clicked product
        window.location.href = `/tatcasach.html?authors=${authorId}`;
    });
    bookInformation.appendChild(bookInf);

    bookDetail.category.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.classList.add("category", "me-3");
        categoryLink.textContent = category.name;
        bookInf.querySelector(".author-categories").appendChild(categoryLink);
    })

    const contentWrap = document.createElement('div');
    contentWrap.classList.add("content-nav-wrap", "cf");
    contentWrap.innerHTML = `
    <div class="nav-wrap">
        <ul>
            <li class="act"><a class="lang more-detail" >Thông tin chi tiết</a></li>
            <li class><a class="lang liChapter" >Danh sách chương</a></li>
            <li><a class="lang user-discuss" href="#user-discuss">Bình luận</a></li>
        </ul>
    </div>
    `;
    
    bookInformation.insertAdjacentElement('afterend', contentWrap);

    const moreDetailLink = producSession.querySelector(".more-detail");
    const liChapterLink = producSession.querySelector(".liChapter");
    const userDiscussLink = producSession.querySelector(".user-discuss");

    moreDetailLink.addEventListener("click", function() {
        changeTab(1);
    });

    liChapterLink.addEventListener("click", function() {
        changeTab(2);
    });

    userDiscussLink.addEventListener("click", function() {
        changeTab(1);
    });
    
    const bookWrap = document.createElement('div');
    bookWrap.classList.add("book-info-wrap");
    bookWrap.innerHTML = `
    <div class="book-intro">
        <p class="description">${description}</p>
    </div>

    <div class="divider-y"></div>

    <div class="book-author">
        <ul>
            <li>Tác giả: ${authorName}</li>
            
        </ul>
    </div>

    <div class="user-commentWrap">
        <div class="comment-head cf">
            <h3 class="lang">
                <span class="goDiscuss act" onclick="changeBox(1)">Bình luận</span>
                <i class="grey">|</i>
                <span class="goRatting" onclick="changeBox(2)">Đánh giá</span>
            </h3>
        </div>
        <div id="comments-section">
    <h3>Comments</h3>
    <div id="comments-list"></div>
    <div id="comment-form">
        <textarea id="comment-content" placeholder="Add a comment..."></textarea>
        <button onclick="addComment()">Submit</button>
    </div>
</div>

    </div>
    `;
    bookContent.appendChild(bookWrap);

    // Write code to trigger the click event on <a> tag have id "rentbtn", then a pdf emded will be shown
    const readbtn = bookInf.querySelector("#readbtn");
    readbtn.addEventListener("click", function() {
        window.location.href = '../book-reading-page/viec-lang_ngo-tat-to.pdf';
    });

});

